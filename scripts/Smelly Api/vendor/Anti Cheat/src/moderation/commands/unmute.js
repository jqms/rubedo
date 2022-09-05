import { SA } from "../../../../../index.js";
import { db_mutes } from "../../index.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "unmute",
  description: "Unmutes a muted player",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("playerName", "string", "Player to unfreeze")
  .executes((ctx, { playerName }) => {
    const mute = db_mutes.values().find((mute) => mute.player == playerName);
    if (!mute) return ctx.reply(`${playerName} is not muted!`);

    db_mutes.delete(mute.player);
    ctx.reply(`§a${playerName}§r has been UnMuted!`);
  });
