import { getId, MS } from "../../utils.js";
import { TABLES } from "../../index.js";
export class Mute {
    /**
     * Mutes a player for a length
     */
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
    /**
     * Gets the mute data for this player
     * @param {Player} player player to get
     * @returns {muteData | null}
     */
    static getMuteData(player) {
        return TABLES.mutes.get(getId(player));
    }
}
