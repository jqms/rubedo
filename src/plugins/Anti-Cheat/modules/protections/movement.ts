import {
  MinecraftEffectTypes,
  Player,
  Vector3,
  world,
} from "@minecraft/server";
//import { CURRENT_TICK } from "../../../../index";
import { onPlayerMove } from "../../../../lib/Events/onPlayerMove";
import {
  AUTO_FLAG_DISTANCE_THRESHOLD,
  MOVEMENT_CONSTANTS,
  MOVEMENT_DISTANCE_THRESHOLD,
  MOVEMENT_VIOLATION_THRESHOLD,
  SPEED_EFFECT_INCREASE,
  TAGS,
} from "../../config/movement";
import { getRole } from "../../utils";
import { PlayerLog } from "../models/PlayerLog";
//import { MOVEMENT_DISTANCE_THRESHOLD } from "../../config/movement";

// Each speed effect increase, yeilds `0.056` more distance between old location and new location per tick

/**
 * Caculates the distance from loc1 to loc2
 * @param {Location} loc1 location 1
 * @param {Location} loc2 location 2
 * @returns {number}
 */
function distanceBetween(loc1: Vector3, loc2: Vector3): number {
  return Math.hypot(loc2.x - loc1.x, loc2.z - loc1.z);
}

const violations = new PlayerLog<number>();

onPlayerMove.subscribe((player, old) => {
  if (getRole(player) == "admin") return;
  if (player.dimension.id != old.dimension.id) return;
  if (player.hasTag(`skip-movement-check`))
    return player.removeTag(`skip-movement-check`);
  if (player.getTags().some((tag) => TAGS.includes(tag))) return;
  //const currentTick = CURRENT_TICK;
  const speedIntensity =
    (player.getEffect(MinecraftEffectTypes.speed)?.amplifier ?? 0) *
    SPEED_EFFECT_INCREASE;
  const distance = distanceBetween(player.location, old.location);
  if (distance > AUTO_FLAG_DISTANCE_THRESHOLD) {
    player.teleport(
      old.location,
      old.dimension,
      player.rotation.x,
      player.rotation.y
    );
    player.addTag(`skip-movement-check`);
    return;
  }
  if (
    distance <
    MOVEMENT_CONSTANTS.run.distance +
      MOVEMENT_DISTANCE_THRESHOLD +
      speedIntensity
  )
    return;
  const violationCount = (violations.get(player) ?? 0) + 1;
  violations.set(player, violationCount);
  if (violationCount < MOVEMENT_VIOLATION_THRESHOLD) return;
  violations.set(player, 0);
  player.teleport(
    old.location,
    old.dimension,
    player.rotation.x,
    player.rotation.y
  );
  player.addTag(`skip-movement-check`);
});

world.events.dataDrivenEntityTriggerEvent.subscribe((data) => {
  if (!(data.entity instanceof Player)) return;
  if (data.id != "on_death") return;
  data.entity.addTag(`skip-movement-check`);
});
