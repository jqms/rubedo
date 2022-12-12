import { system } from "@minecraft/server";
import { setWorldIsLoaded, WORLD_IS_LOADED } from "../../index.js";
import { DIMENSIONS } from "../../utils";

/**
 * Splits a string into chunk sizes
 */
export function chunkString(str: string, length: number): string[] {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}

/**
 * Awaits till work load
 * @returns
 */
export async function awaitWorldLoad(): Promise<void> {
  if (WORLD_IS_LOADED) return;
  return new Promise((resolve) => {
    let s = system.runSchedule(async () => {
      try {
        await DIMENSIONS.overworld.runCommandAsync(`testfor @a`);
        system.clearRunSchedule(s);
        setWorldIsLoaded();
        resolve();
      } catch (error) {}
    }, 1);
  });
}

/**
 * Sends a callback once world is loaded
 * @param callback
 */
export function onWorldLoad(callback: () => void) {
  if (WORLD_IS_LOADED) return callback();
  let s = system.runSchedule(async () => {
    try {
      await DIMENSIONS.overworld.runCommandAsync(`testfor @a`);
      system.clearRunSchedule(s);
      setWorldIsLoaded();
      callback();
    } catch (error) {}
  }, 1);
}
