import { db_freezes } from "../../index.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unfreeze",
  description: "Unfreeze a frozen player",
  hasPermission: (player) => getRole(player) == "admin",
})
  .addOption("playerName", "string", "Player to unfreeze")
  .executes((ctx, { playerName }) => {
    const freeze = db_freezes.values().find((freze) => freze.player == playerName);
    if (!freeze) return ctx.reply(`${playerName} is not frozen`);

    db_freezes.delete(freeze.key);
    ctx.reply(`§a${playerName}§r has been UnFrozen!`);
  });
