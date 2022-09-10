import { Player } from "mojang-minecraft";
import { getId, MS } from "../../utils.js";
import { TABLES } from "../../index.js";

/**
 * @typedef {Object} muteData
 * @property {number} player playerID this is associated with
 * @property {number} date the date of this mute
 * @property {number | null} length the length in ms
 * @property {number | null} expire the ms when this mute will end
 * @property {string} reason the reason for this mute
 * @property {string} by who this mute was by
 */

export class Mute {
  /**
   * Gets the mute data for this player
   * @param {Player} player player to get
   * @returns {muteData | null}
   */
  static getMuteData(player) {
    return TABLES.mutes.get(getId(player));
  }
  /**
   * Mutes a player for a length
   * @param {Player} player
   * @param {number} length
   * @param {string} unit
   * @param {string} reason
   * @param {Player.name} by
   */
  constructor(
    player,
    length = null,
    unit = null,
    reason = "No Reason",
    by = "Smelly Anti Cheat"
  ) {
    player.runCommand(`ability @s mute true`);
    length = length ? MS(`${length} ${unit}`) : null;
    const data = {
      player: getId(player),
      date: Date.now(),
      length: length,
      expire: length ? length + Date.now() : null,
      reason: reason,
      by: by,
    };
    TABLES.mutes.set(getId(player), data);
  }
}
