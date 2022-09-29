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

interface IMuteData {
  player: string;
  date: number;
  length: number | null;
  expire: number | null;
  reason: string;
  by: string;
}

export class Mute {
  length: number;
  /**
   * Gets the mute data for this player
   * @param {Player} player player to get
   * @returns {muteData | null}
   */
  static getMuteData(player: Player) {
    return TABLES.mutes.get(getId(player));
  }
  /**
   * Mutes a player for a length
   */
  constructor(
    player: Player,
    length?: number,
    unit?: string,
    reason: string = "No Reason",
    by: string = "Smelly Anti Cheat"
  ) {
    player.runCommand(`ability @s mute true`);
    const msLength = length ? MS(`${length} ${unit}`) : null;
    const data: IMuteData = {
      player: getId(player),
      date: Date.now(),
      length: msLength,
      expire: msLength ? msLength + Date.now() : null,
      reason: reason,
      by: by,
    };
    TABLES.mutes.set(getId(player), data);
  }
}
