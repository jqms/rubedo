import { ArgumentTypes, Command } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unban",
  description: "Unban a banned player",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.playerName("playerName"))
  .executes((ctx, playerName) => {
    const banData = TABLES.bans
      .values()
      .find((ban) => ban.playerName == playerName);
    if (!banData) return ctx.reply(`${playerName} is not banned`);
    if (TABLES.bans.delete(banData.key)) {
      ctx.reply(`§a${playerName}§r has been Unbanned!`);
    } else {
      ctx.reply(`§cFailed to unban ${playerName}`);
    }
  });
