import { Vector3 } from "@minecraft/server";
import "./modules/commands/import";
import "./modules/managers/import";
import "./modules/pages/import";
import "./modules/protections/import";
import "./modules/events/import";

/**
 * Stores npc locations that are verified to allow npcs to spawn in
 */
export let NPC_LOCATIONS: Array<Vector3> = [];

export function clearNpcLocations() {
  NPC_LOCATIONS = [];
}
