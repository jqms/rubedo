import { TABLES } from "../../lib/Database/tables.js";
import { MS } from "../../utils.js";
export class Mute {
    constructor(player, length, unit, reason = "No Reason", by = "Smelly Anti Cheat") {
        player.runCommand(`ability @s mute true`);
        const msLength = length ? MS(`${length} ${unit}`) : null;
        const data = {
            player: player.name,
            date: Date.now(),
            length: msLength,
            expire: msLength ? msLength + Date.now() : null,
            reason: reason,
            by: by,
        };
        TABLES.mutes.set(player.name, data);
    }
    static getMuteData(player) {
        return TABLES.mutes.get(player.name);
    }
}
