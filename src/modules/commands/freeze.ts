import { Command } from "../../lib/Commands/Command.js";
import { Freeze } from "../models/Freeze.js";
import { getRole } from "../../utils.js";
import { Player } from "mojang-minecraft";

new Command({
  name: "freeze",
  description: "Freeze a player",
  hasPermission: (player) => getRole(player) == "admin",
})
  .addOption("player", "player", "Player to ban")
  .addOption("reason", "string", "reason for ban", true)
  .executes((ctx, { player, reason }: { player: Player; reason: string }) => {
    new Freeze(player, reason);
    ctx.reply(
      `§cFroze §f"§a${player.name}§f" Because: "${
        reason ?? "No reason Provided"
      }" §aSuccessfully`
    );
    ctx.sender.tell(
      `§cYou have been frozen by §f"§a${ctx.sender.nameTag}§f" Because: "${
        reason ?? "No reason Provided"
      }"`
    );
  });
