console.warn(`---- STARTING RUBEDO ----`);
import { ItemStack, MinecraftItemTypes, world } from "@minecraft/server";
import "./lib/Command/index";
import "./lib/Chest GUI/index";
import "./plugins/import";

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
