import {
  MinecraftBlockTypes,
  MinecraftEffectTypes,
  MinecraftItemTypes,
  Player,
  system,
  Vector3,
} from "@minecraft/server";
import { PlayerLog } from "../../../../rubedo/database/types/PlayerLog";
import {
  ILocationLog,
  onPlayerMove,
} from "../../../../rubedo/lib/Events/onPlayerMove";
import { vector3ToBlockLocation } from "../../../../utils";
import {
  ANTI_TP_DISTANCE_THRESHOLD,
  DIMENSION_SWITCH_Y,
  MOVEMENT_CONSTANTS,
  MOVEMENT_DISTANCE_THRESHOLD,
  RIPTIDE_TIMEOUT,
  SPEED_EFFECT_INCREASE,
  TAGS,
} from "../../config/movement";
import { getRole } from "../../utils";
import { Protection } from "../models/Protection";
import { VALID_BLOCK_TAGS } from "./nuker";

const violations = new PlayerLog<number>();

/**
 * Players that are on riptide timeout for using a trident
 */
const ON_RIPTIDE_TIMEOUT = new PlayerLog<boolean>();

/**
 * Calculates the distance from loc1 to loc2
 * @param {Location} loc1 location 1
 * @param {Location} loc2 location 2
 * @returns {number}
 */
function distanceBetween(loc1: Vector3, loc2: Vector3): number {
  return Math.hypot(loc2.x - loc1.x, loc2.z - loc1.z);
}

/**
 * Gets the speed offset based on a players SpeedEffect
 * @param player player to get
 */
function getSpeedOffset(player: Player): number {
  const speed = player.getEffect(MinecraftEffectTypes.speed)?.amplifier ?? 0;
  return speed * SPEED_EFFECT_INCREASE;
}

/**
 * Checks if a distance traveled is big enough to be flagged
 * @param distance distance the player has traveled
 * @returns if this distance is bad
 */
function isDistanceFlag(
  distance: number,
  tick: number,
  player: Player
): boolean {
  const speedIntensity = getSpeedOffset(player);
  /**
   * This is the amount of ticks that have passed
   */
  const ticks = system.currentTick - tick;
  const offset = MOVEMENT_CONSTANTS.run.distance + MOVEMENT_DISTANCE_THRESHOLD;
  return distance / ticks > speedIntensity + offset;
}

function flag(player: Player, old: ILocationLog) {
  const violationCount = (violations.get(player) ?? 0) + 1;
  violations.set(player, violationCount);
  onPlayerMove.delete(player); // Reset Players old location
  if (violationCount < 3) return;
  player.teleport(
    old.location,
    old.dimension,
    player.rotation.x,
    player.rotation.y
  );
}

function flagPhase(player: Player): boolean {
  const blockIn = player.dimension.getBlock(
    vector3ToBlockLocation(player.location)
  );
  if (blockIn.getTags().some((tag) => VALID_BLOCK_TAGS.includes(tag))) return;
  if (blockIn.type.id.endsWith("grass")) return;
  if (blockIn.type.id.endsWith("water")) return;
  if (blockIn.type.id.endsWith("lava")) return;
  if (blockIn.type.id.endsWith("portal")) return;
  if (blockIn.type.id.endsWith("gateway")) return;

  if (
    blockIn.typeId != MinecraftBlockTypes.air.id &&
    !blockIn.type.canBeWaterlogged
  )
    return false;
}

/**
 * The key used to unsubscribe from this event
 */
let onPlayerMoveSubKey: number = null;

const protection = new Protection<{
  tpCheck: boolean;
}>(
  "movement",
  "Blocks illegal movements on players",
  "textures/ui/move.png",
  false
).setConfigDefault({
  tpCheck: {
    description: "If teleports should be flagged",
    defaultValue: true,
  },
});

protection
  .onEnable(() => {
    const config = protection.getConfig();
    onPlayerMoveSubKey = onPlayerMove.subscribe((player, old) => {
      if (getRole(player) == "admin") return;
      if (player.dimension.id != old.dimension.id) return;
      if (player.getTags().some((tag) => TAGS.includes(tag))) return;
      const distance = distanceBetween(player.location, old.location);
      if (player.hasTag(`skip-movement-check`))
        return player.removeTag(`skip-movement-check`);
      if (old.location.y == DIMENSION_SWITCH_Y) return;
      if (ON_RIPTIDE_TIMEOUT.has(player)) return;
      if (flagPhase(player)) return flag(player, old);
      if (distance > ANTI_TP_DISTANCE_THRESHOLD) {
        if (!config.tpCheck) return;
        // Anti Tp.
        flag(player, old);
      } else {
        // Anti speed/jet pack
        if (!isDistanceFlag(distance, old.currentTick, player)) return;
        // Flagged
        flag(player, old);
      }
    });
  })
  .onDisable(() => {
    onPlayerMove.unsubscribe(onPlayerMoveSubKey);
  });

protection.subscribe("dataDrivenEntityTriggerEvent", (data) => {
  if (!(data.entity instanceof Player)) return;
  if (data.id != "on_death") return;
  const player = data.entity;
  system.run(() => {
    onPlayerMove.delete(player);
  }); // Reset Players old location
});

protection.subscribe("projectileHit", ({ projectile, source }) => {
  if (projectile.typeId != MinecraftItemTypes.enderPearl.id) return;
  if (!(source instanceof Player)) return;
  onPlayerMove.delete(source); // Reset Players old location
});

protection.subscribe("itemCompleteCharge", ({ itemStack, source }) => {
  if (itemStack.typeId != MinecraftItemTypes.chorusFruit.id) return;
  if (!(source instanceof Player)) return;
  onPlayerMove.delete(source); // Reset Players old location
});

protection.subscribe("itemReleaseCharge", ({ itemStack, source }) => {
  if (itemStack.typeId != MinecraftItemTypes.trident.id) return;
  if (!(source instanceof Player)) return;
  ON_RIPTIDE_TIMEOUT.set(source, true);
  system.runSchedule(() => {
    ON_RIPTIDE_TIMEOUT.delete(source);
  }, RIPTIDE_TIMEOUT);
});
