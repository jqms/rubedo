import { SA } from "../../../../../index.js";
import { Ban } from "../../Models/Ban.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "ban",
  description: "Ban players for lengths",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("player", "player", "Player to ban")
  .addOption("length", "int", "Time ammount to ban")
  .addOption("unit", "string", "The unit for the time")
  .addOption("reason", "string", "reason for ban", true)
  .executes((ctx, { player, length, unit, reason }) => {
    new Ban(player, length, unit, reason, ctx.sender.name);
    ctx.reply(
      `§cBanned §f"§a${player.name}§f" §cfor ${length} ${unit} Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
  });
