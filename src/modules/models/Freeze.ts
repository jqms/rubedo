import { Player } from "mojang-minecraft";
import { getId } from "../../utils.js";
import { TABLES } from "../../index.js";

export class Freeze {
  /**
   * Freeze a player
   */
  constructor(player: Player, reason: string = "No Reason") {
    const data = {
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
