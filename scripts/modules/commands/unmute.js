import { db_mutes } from "../../index.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unmute",
  description: "Unmutes a muted player",
  hasPermission: (player) => ["admin", "moderator"].includes(getRole(player)),
})
  .addOption("playerName", "string", "Player to unfreeze")
  .executes((ctx, { playerName }) => {
    const mute = db_mutes.values().find((mute) => mute.player == playerName);
    if (!mute) return ctx.reply(`${playerName} is not muted!`);

    db_mutes.delete(mute.player);
    try {
      ctx.sender.runCommand(`ability "${playerName}" mute false`);
    } catch (error) {}
    ctx.reply(`§a${playerName}§r has been UnMuted!`);
  });
