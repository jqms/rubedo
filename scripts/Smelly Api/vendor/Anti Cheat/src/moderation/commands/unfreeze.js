import { SA } from "../../../../../index.js";
import { db_freezes } from "../../index.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "unfreeze",
  description: "Unfreeze a frozen player",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("playerName", "string", "Player to unfreeze")
  .executes((ctx, { playerName }) => {
    const freeze = db_freezes.values().find((freze) => freze.player == playerName);
    if (!freeze) return ctx.reply(`${playerName} is not frozen`);

    db_freezes.delete(freeze.key);
    ctx.reply(`§a${playerName}§r has been UnFrozen!`);
  });
