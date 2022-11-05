import { ArgumentTypes, Command } from "../../lib/Command/Command.js";
import { Mute } from "../models/Mute.js";
import { getRole } from "../../utils.js";

new Command({
  name: "mute",
  description: "Mute a player for lengths",
  requires: (player) => ["admin", "moderator"].includes(getRole(player)),
})
  .argument(new ArgumentTypes.player("player"))
  .argument(new ArgumentTypes.duration("duration"))
  .string("reason")
  .executes((ctx, player, duration, reason) => {
    new Mute(player, duration, reason, ctx.sender.name);
    ctx.reply(
      `§cMuted §f"§a${player.name}§f" §cfor ${duration} Because: "${reason}" §aSuccessfully`
    );
    player.tell(
      `§cYou have been muted by §f"${ctx.sender.name}" §cfor ${duration} Because: "${reason}"`
    );
  });
