import { Player } from "mojang-minecraft";
import { TABLES } from "../../lib/Database/tables.js";
import type { IMuteData } from "../../types.js";
import { MS } from "../../utils.js";

export class Mute {
  length: number;
  /**
   * Gets the mute data for this player
   */
  static getMuteData(player: Player): IMuteData {
    return TABLES.mutes.get(player.name);
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
      player: player.name,
      date: Date.now(),
      length: msLength,
      expire: msLength ? msLength + Date.now() : null,
      reason: reason,
      by: by,
    };
    TABLES.mutes.set(player.name, data);
  }
}
