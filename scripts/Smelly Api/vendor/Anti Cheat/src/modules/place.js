import { world, MinecraftBlockTypes } from "mojang-minecraft";
import { BANNED_BLOCKS } from "../config.js";
import { getRole } from "../utils.js";

/**
 * Minecraft Bedrock Anti Bad Blocks
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This anti block place stops players from placing unwanted blocks
 * Simpliy when a player places a blocks it tests if that block is banned
 * And cancles that block from being placed, (add more blocks to list)
 * --------------------------------------------------------------------------
 */

world.events.blockPlace.subscribe(({ block, player }) => {
  if (["moderator", "admin"].includes(getRole(player.name))) return;
  if (BANNED_BLOCKS.includes(block.id)) block.setType(MinecraftBlockTypes.air);
});
