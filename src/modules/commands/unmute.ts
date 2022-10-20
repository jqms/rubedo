import { Command } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unmute",
  description: "Unmutes a muted player",
  requires: (player) => ["admin", "moderator"].includes(getRole(player)),
})
  .string("playerName")
  .executes((ctx, playerName) => {
    const mute = TABLES.mutes
      .values()
      .find((mute) => mute.player == playerName);
    if (!mute) return ctx.reply(`${playerName} is not muted!`);

    TABLES.mutes.delete(mute.player);
    try {
      ctx.sender.runCommand(`ability "${playerName}" mute false`);
    } catch (error) {}
    ctx.reply(`§a${playerName}§r has been UnMuted!`);
  });
