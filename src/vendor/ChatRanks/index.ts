import { Player, world } from "@minecraft/server";
import { beforeChat } from "../../rubedo/lib/Events/beforeChat";

/**
 * The prefix that is added before a rank tag
 * @example `/tag @s add "RANK_PREFIX"member`
 */
const RANK_PREFIX = "rank:";

/**
 * The default Rank that the player has in chat with no ranks
 */
const DEFAULT_RANK = "§bMember";

/**
 * Gets chat ranks from a player
 * @param player
 * @returns ranks player has
 */
function getRanks(player: Player): string[] {
  const ranks = player
    .getTags()
    .map((v) => {
      if (!v.startsWith(RANK_PREFIX)) return null;
      return v.substring(RANK_PREFIX.length);
    })
    .filter((x) => x);
  return ranks.length == 0 ? [DEFAULT_RANK] : ranks;
}

beforeChat.subscribe((data) => {
  data.sendToTargets = true;
  data.targets = [];
  const ranks = getRanks(data.sender).join("§r§l§8][§r");
  const message = data.message;
  world.say(`§r§l§8[§r${ranks}§r§l§8]§r§7 ${data.sender.name}:§r ${message}`);
});
