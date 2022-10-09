import { TABLES } from "../../lib/Database/tables.js";
import { getId, MS } from "../../utils.js";
export class Ban {
    constructor(player, length, unit, reason = "No Reason", by = "Smelly Anti Cheat") {
        length = length ? MS(`${length} ${unit}`) : null;
        const data = {
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
