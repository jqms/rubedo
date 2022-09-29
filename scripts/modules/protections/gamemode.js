import { GameMode, world } from "mojang-minecraft";
import { setTickInterval } from "../../lib/Scheduling/utils.js";
import { getRole } from "../../utils.js";
/**
 * Minecraft Bedrock Anti Gamemode
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This checks every tick to test if a player has entered a gamemode that they
 * shouldnet be able to get into. If the player has the staff tag it wont
 * check the list of illegle gamemodes are below
 * --------------------------------------------------------------------------
 */
/**
 * The gamemode that you cannot be in unless you have staff tag
 */
const ILLEGLE_GAMEMODE = GameMode.creative;
setTickInterval(() => {
    for (const player of world.getPlayers({ gameMode: ILLEGLE_GAMEMODE })) {
        if (["moderator", "admin"].includes(getRole(player)))
            return;
        try {
            player.runCommand(`gamemode s`);
            player.runCommand(`clear @s`);
        }
        catch (error) { }
    }
}, 20);
