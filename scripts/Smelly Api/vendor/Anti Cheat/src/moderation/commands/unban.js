import { SA } from "../../../../../index.js";
import { db_bans } from "../../index.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "unban",
  description: "Unban a banned player",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("playerName", "string", "Player to ban")
  .executes((ctx, { playerName }) => {
    const banData = db_bans.values().find((ban) => ban.player == playerName);
    if (!banData) return ctx.reply(`${playerName} is not banned`);
    db_bans.delete(banData.key);
    ctx.reply(`§a${playerName}§r has been Unbanned!`);
  });
