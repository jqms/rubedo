import { getId, MS } from "../../utils.js";
import { TABLES } from "../../index.js";
export class Mute {
    constructor(player, length, unit, reason = "No Reason", by = "Smelly Anti Cheat") {
        player.runCommand(`ability @s mute true`);
        const msLength = length ? MS(`${length} ${unit}`) : null;
        const data = {
            player: getId(player),
            date: Date.now(),
            length: msLength,
            expire: msLength ? msLength + Date.now() : null,
            reason: reason,
            by: by,
        };
        TABLES.mutes.set(getId(player), data);
    }
    static getMuteData(player) {
        return TABLES.mutes.get(getId(player));
    }
}
