console.warn(`---- STARTING RUBEDO ----`);
import { ItemStack, MinecraftItemTypes } from "@minecraft/server";
import "./lib/Command/index";
import "./lib/Chest GUI/index";
import "./plugins/import";

/**
 * This is air as a item,
 */
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

/**
 * If the world is loaded or not
 */
export let WORLD_IS_LOADED = false;

/**
 * Sets the world to loaded
 */
export function setWorldIsLoaded() {
  WORLD_IS_LOADED = true;
}
