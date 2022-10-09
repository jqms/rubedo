import { TABLES } from "../../lib/Database/tables.js";
import { getId } from "../../utils.js";
export class Freeze {
    constructor(player, reason = "No Reason") {
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
