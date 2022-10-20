import { Command } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unban",
  description: "Unban a banned player",
  requires: (player) => getRole(player) == "admin",
})
  .string("playerName")
  .executes((ctx, playerName) => {
    const banData = TABLES.bans
      .values()
      .find((ban) => ban.player == playerName);
    if (!banData) return ctx.reply(`${playerName} is not banned`);
    TABLES.bans.delete(banData.key);
    ctx.reply(`§a${playerName}§r has been Unbanned!`);
  });
