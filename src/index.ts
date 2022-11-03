console.warn(`---- STARTING RUBEDO ----`);
import {
  ItemStack,
  Location,
  MinecraftItemTypes,
  world,
} from "@minecraft/server";
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
 * This is the current tick that the server is at
 * this gets tracked to reduce lag for calling it
 */
export let CURRENT_TICK: number = null;

/**
 * This is air as a item,
 */
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

world.events.tick.subscribe((data) => {
  if (!CURRENT_TICK) {
    CURRENT_TICK = data.currentTick;
  } else {
    CURRENT_TICK = CURRENT_TICK + 1;
  }
});
