import { world } from "mojang-minecraft";
export class PlayerLog {
    constructor() {
        this.data = new Map();
        this.events = {
            playerLeave: world.events.playerLeave.subscribe((data) => this.data.delete(data.playerName)),
        };
    }
    /**
     * Logs a player to a value
     */
    set(player, value) {
        this.data.set(player.name, value);
    }
    /**
     * Gets a players value
     */
    get(player) {
        return this.data.get(player.name);
    }
    /**
     * Deletes a player from log
     */
    delete(player) {
        this.data.delete(player.name);
    }
    /**
     * Clears this Player log
     */
    clear() {
        this.data.clear();
    }
    /**
     * Gets all the players in the log
     */
    playerNames() {
        return [...this.data.keys()];
    }
}
