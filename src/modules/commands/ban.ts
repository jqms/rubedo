import { text } from "../../lang/text.js";
import { Command, ArgumentTypes } from "../../lib/Command/Command.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";

new Command({
  name: "ban",
  description: "Bans a player for lengths",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.player("player"))
  .executes((ctx, player) => {
    new Ban(player, null, null, ctx.sender.name);
    ctx.reply(
      text["modules.commands.ban.reply"](player.name, 0, "Forever", "No Reason")
    );
  })
  .argument(new ArgumentTypes.int("length"))
  .argument(new ArgumentTypes.unit("unit"))
  .executes((ctx, player, length, unit) => {
    new Ban(player, length, unit, null, ctx.sender.name);
    ctx.reply(
      text["modules.commands.ban.reply"](player.name, length, unit, "No Reason")
    );
  })
  .string("reason")
  .executes((ctx, player, length, unit, reason) => {
    new Ban(player, length, unit, reason, ctx.sender.name);
    ctx.reply(
      text["modules.commands.ban.reply"](player.name, length, unit, reason)
    );
  });
