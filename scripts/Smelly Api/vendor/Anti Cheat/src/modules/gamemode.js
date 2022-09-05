import { EntityQueryOptions, GameMode, world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { Ban } from "../Models/Ban.js";
import { getRole } from "../utils.js";

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

SA.Utilities.time.setTickInterval(() => {
  const q = new EntityQueryOptions();
  q.gameMode = ILLEGLE_GAMEMODE;
  for (const player of world.getPlayers(q)) {
    if (getRole(player.name) == "moderator" || "admin") continue;
    new Ban(player, null, null, "Illegle Gamemode");
  }
}, 20);
