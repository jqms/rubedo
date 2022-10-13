import { Player } from "mojang-minecraft";
import { TABLES } from "../../lib/Database/tables.js";
import type { IFreezeData } from "../../types.js";
import { getId } from "../../utils.js";

export class Freeze {
  /**
   * Freeze a player
   */
  constructor(player: Player, reason: string = "No Reason") {
    const data: IFreezeData = {
      player: player.name,
      key: getId(player),
      reason: reason,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
        dimension: player.dimension.id,
      },
    };
    TABLES.freezes.set(getId(player), data);
  }
}
