import { ArgumentTypes, Command } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

new Command({
  name: "unfreeze",
  description: "Unfreeze a frozen player",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.playerName("playerName"))
  .executes((ctx, playerName) => {
    const freeze = TABLES.freezes
      .values()
      .find((freze) => freze.player == playerName);
    if (!freeze) return ctx.reply(`${playerName} is not frozen`);

    TABLES.freezes.delete(freeze.key);
    ctx.reply(`§a${playerName}§r has been UnFrozen!`);
  });
