import { Player } from "@minecraft/server";
import { TABLES } from "../../../../lib/Database/tables.js";
import type { IBanData } from "../../../../types.js";
import { durationToMs } from "../../../../utils.js";

export class Ban {
  /**
   * Ban a player for a set length
   */
  constructor(
    player: string | Player,
    duration?: string,
    reason: string = "No Reason",
    by: string = "Rubedo Auto Mod"
  ) {
    const id = player instanceof Player ? player.id : TABLES.ids.get(player);
    if (!id) throw new Error(`"${player}" does not have a saved id!`);
    const data: IBanData = {
      key: id,
      playerName: player instanceof Player ? player.name : player,
      date: Date.now(),
      duration: duration ? durationToMs(duration) : null,
      expire: duration ? durationToMs(duration) + Date.now() : null,
      reason: reason,
      by: by,
    };
    TABLES.bans.set(id, data);
  }
}
