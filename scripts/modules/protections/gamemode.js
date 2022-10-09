import { GameMode, world } from "mojang-minecraft";
import { setTickInterval } from "../../lib/Scheduling/utils.js";
import { getRole } from "../../utils.js";
const ILLEGLE_GAMEMODE = GameMode.creative;
setTickInterval(() => {
    for (const player of world.getPlayers({ gameMode: ILLEGLE_GAMEMODE })) {
        if (["moderator", "admin", "builder"].includes(getRole(player)))
            return;
        try {
            player.runCommand(`gamemode s`);
            player.runCommand(`clear @s`);
        }
        catch (error) { }
    }
}, 20);
