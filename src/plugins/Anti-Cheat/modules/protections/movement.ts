import {
  MinecraftEffectTypes,
  MinecraftItemTypes,
  Player,
  Vector3,
  world,
} from "@minecraft/server";
//import { CURRENT_TICK } from "../../../../index";
import {
  ILocationLog,
  onPlayerMove,
} from "../../../../lib/Events/onPlayerMove";
import {
  ANTI_TP_DISTANCE_THRESHOLD,
  MOVEMENT_CONSTANTS,
  MOVEMENT_DISTANCE_THRESHOLD,
  SPEED_EFFECT_INCREASE,
  TAGS,
} from "../../config/movement";
import { getRole } from "../../utils";
import { PlayerLog } from "../models/PlayerLog";

const violations = new PlayerLog<number>();

/**
 * Caculates the distance from loc1 to loc2
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
 * Checks if a distance travled is big enough to be flaggable
 * @param distance distance the player has travled
 * @returns if this distance is flagable
 */
function isDistanceFlaggable(distance: number, player: Player): boolean {
  const speedIntensity = getSpeedOffset(player);
  const offset = MOVEMENT_CONSTANTS.run.distance + MOVEMENT_DISTANCE_THRESHOLD;
  return distance > speedIntensity + offset;
}

function flag(player: Player, old: ILocationLog) {
  player.teleport(
    old.location,
    old.dimension,
    player.rotation.x,
    player.rotation.y
  );
  const violationCount = (violations.get(player) ?? 0) + 1;
  violations.set(player, violationCount);
  onPlayerMove.delete(player); // Reset Players old location
}

onPlayerMove.subscribe((player, old) => {
  if (getRole(player) == "admin") return;
  if (player.dimension.id != old.dimension.id) return;
  if (player.getTags().some((tag) => TAGS.includes(tag))) return;
  const distance = distanceBetween(player.location, old.location);
  if (player.hasTag(`skip-movement-check`))
    return player.removeTag(`skip-movement-check`);
  if (distance > ANTI_TP_DISTANCE_THRESHOLD) {
    // Anti Tp.
    flag(player, old);
  } else {
    // Anti speed/jetpack
    if (!isDistanceFlaggable(distance, player)) return;
    // Flagged
    flag(player, old);
  }
});

world.events.dataDrivenEntityTriggerEvent.subscribe((data) => {
  if (!(data.entity instanceof Player)) return;
  if (data.id != "on_death") return;
});

world.events.projectileHit.subscribe(({ projectile, source }) => {
  if (projectile.typeId != MinecraftItemTypes.enderPearl.id) return;
  if (!(source instanceof Player)) return;
  onPlayerMove.delete(source); // Reset Players old location
});

world.events.itemCompleteCharge.subscribe(({ itemStack, source }) => {
  if (itemStack.typeId != MinecraftItemTypes.chorusFruit.id) return;
  if (!(source instanceof Player)) return;
  onPlayerMove.delete(source); // Reset Players old location
});
