import { Player } from "mojang-minecraft";
import { TABLES } from "../../lib/Database/tables.js";
import type { IBanData } from "../../types.js";
import { getId, MS } from "../../utils.js";

export class Ban {
  /**
   * Ban a player for a set length
   */
  constructor(
    player: Player,
    length?: number,
    unit?: string,
    reason: string = "No Reason",
    by: string = "Smelly Anti Cheat"
  ) {
    length = length ? MS(`${length} ${unit}`) : null;
    const data: IBanData = {
      key: getId(player),
      player: player.name,
      date: Date.now(),
      length: length,
      expire: length ? length + Date.now() : null,
      reason: reason,
      by: by,
    };
    TABLES.bans.set(getId(player), data);
  }
}
