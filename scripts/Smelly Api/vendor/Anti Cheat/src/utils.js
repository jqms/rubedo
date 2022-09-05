import {
  EntityQueryOptions,
  world,
  Player,
  TickEvent,
  BlockLocation,
  MinecraftBlockTypes,
} from "mojang-minecraft";
import { db_permissions } from "./index.js";
import { Region } from "./Models/Region";

/**
 * Kicks a player
 * @param {Player} player player to kick
 * @param {Array<String>} message array of data to send in the kick message
 * @param {() => {}} onFail if this kick was failed, meaning this player should be unbanned
 */
export function kick(player, message = [], onFail = null) {
  try {
    player.runCommand(`kick "${player.nameTag}" §r${message.join("\n")}`);
    player.triggerEvent("kick");
  } catch (error) {
    if (!/"statusCode":-2147352576/.test(error)) return;
    // This function just tried to kick the owner
    if (onFail) onFail();
  }
}

/**
 * Gets the role of this player
 * @param {String} playerName player to get role from
 * @returns {"member" | "moderator" | "admin"}
 * @example getRole("Smell of curry")
 */
export function getRole(playerName) {
  const role = db_permissions.get(playerName);
  return role ?? "member";
}

/**
 * Sets the role of this player
 * @param {String} playerName player to set role to
 * @param {"member" | "moderator" | "admin"} value what to set the role of this player to
 * @example setRole("Smell of curry", "admin")
 */
export function setRole(playerName, value) {
  db_permissions.set(playerName, value);
}

/**
 * Sets Deny blocks at bottom of region every 5 mins
 */
export function loadRegionDenys() {
  for (const region of Region.getAllRegions()) {
    const loc1 = new BlockLocation(region.from.x, -64, region.from.z);
    const loc2 = new BlockLocation(region.to.x, -64, region.to.z);
    for (const blockLocation of loc1.blocksBetween(loc2)) {
      world
        .getDimension(region.dimension)
        .getBlock(blockLocation)
        .setType(MinecraftBlockTypes.deny);
    }
  }
}

/**
 * @typedef {Object} playerTickRegister
 * @property {(player, tick) => ()} callback callback to send
 * @property {number} delay delay in ticks
 * @property {number} lastcall the last tick it sent a callback
 */

/**
 * @type {Array<playerTickRegister>}
 */
const CALLBACKS = [];

/**
 * Sends a callback for each player
 * @param {function(Player, TickEvent)} callback
 * @param {number} delay delay in ticks to send callback
 */
export function forEachValidPlayer(callback, delay = 0) {
  CALLBACKS.push({ callback: callback, delay: delay, lastcall: 0 });
}

world.events.tick.subscribe((tick) => {
  const players = [...world.getPlayers()];
  for (const [i, player] of players.entries()) {
    if (["moderator", "admin"].includes(getRole(player.name))) return;
    for (const CALLBACK of CALLBACKS) {
      if (
        CALLBACK.delay != 0 &&
        tick.currentTick - CALLBACK.lastcall < CALLBACK.delay
      )
        continue;
      CALLBACK.callback(player, tick);
      if (i == players.length - 1) CALLBACK.lastcall = tick.currentTick;
    }
  }
});
