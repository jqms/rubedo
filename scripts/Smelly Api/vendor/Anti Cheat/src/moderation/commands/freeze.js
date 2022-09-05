import { SA } from "../../../../../index.js";
import { Freeze } from "../../Models/Freeze.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "freeze",
  description: "Freeze a player",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("player", "player", "Player to ban")
  .addOption("reason", "string", "reason for ban", true)
  .executes((ctx, { player, reason }) => {
    new Freeze(player, reason);
    ctx.reply(
      `§cFroze §f"§a${player.name}§f" Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
    SA.Providers.chat.broadcast(
      `§cYou have been frozen by §f"§a${ctx.sender.nameTag}§f" Because: "${
        reason ?? "No reason Provided"
      }"`,
      player.nameTag
    );
  });
