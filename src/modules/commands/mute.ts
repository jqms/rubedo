import { ArgumentTypes, Command } from "../../lib/Command/Command.js";
import { Mute } from "../models/Mute.js";
import { getRole } from "../../utils.js";

new Command({
  name: "mute",
  description: "Mute a player for lengths",
  requires: (player) => ["admin", "moderator"].includes(getRole(player)),
})
  .argument(new ArgumentTypes.player("player"))
  .argument(new ArgumentTypes.int("length"))
  .argument(new ArgumentTypes.unit("unit"))
  .string("reason")
  .executes((ctx, player, length, unit, reason) => {
    new Mute(player, length, unit, reason, ctx.sender.name);
    ctx.reply(
      `§cMuted §f"§a${player.name}§f" §cfor ${length} ${unit} Because: "${reason}" §aSuccessfully`
    );
    player.tell(
      `§cYou have been muted by §f"${ctx.sender.name}" §cfor ${length} ${unit} Because: "${reason}"`
    );
  });
