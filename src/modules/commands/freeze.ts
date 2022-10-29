import { ArgumentTypes, Command } from "../../lib/Command/Command.js";
import { Freeze } from "../models/Freeze.js";
import { getRole } from "../../utils.js";

new Command({
  name: "freeze",
  description: "Freeze a player",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.player("player"))
  .string("reason")
  .executes((ctx, player, reason) => {
    new Freeze(player, reason);
    ctx.reply(
      `§cFroze §f"§a${player.name}§f" Because: "${reason}" §aSuccessfully`
    );
    ctx.sender.tell(
      `§cYou have been frozen by §f"§a${ctx.sender.name}§f" Because: "${reason}"`
    );
  });
