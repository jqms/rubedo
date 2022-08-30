import { EntityQueryOptions, world, Player, TickEvent } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { STAFF_TAG } from "../config";

const q = new EntityQueryOptions();
q.excludeTags = [STAFF_TAG];

export const STAFF_QUERY = q;

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
  for (const player of world.getPlayers(q)) {
    for (const CALLBACK of CALLBACKS) {
      if (
        CALLBACK.delay != 0 &&
        tick.currentTick - CALLBACK.lastcall < CALLBACK.delay
      )
        continue;
      CALLBACK.callback(player, tick);
      CALLBACK.lastcall = tick.currentTick;
    }
  }
});
