console.warn(`STARTING RUBEDO`)
import { ItemStack, Location, MinecraftItemTypes } from "mojang-minecraft";
import "./lib/Command/index";
import "./lib/Chest GUI/index";
import "./modules/commands/import";
import "./modules/managers/import";
import "./modules/pages/import";
import "./modules/protections/import";
import "./modules/events/import";

/**
 * Stores npc locations that are verified to allow npcs to spawn in
 */
export let NPC_LOCATIONS: Array<Location> = [];

export function clearNpcLocations() {
  NPC_LOCATIONS = [];
}

/**
 * This is air as a item,
 */
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);
