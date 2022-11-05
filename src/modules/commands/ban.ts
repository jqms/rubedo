import { text } from "../../lang/text.js";
import type { CommandCallback } from "../../lib/Command/Callback.js";
import { Command, ArgumentTypes } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";

function ban(
  ctx: CommandCallback,
  player: string,
  duration: string,
  reason: string,
  by: string
) {
  if (TABLES.bans.get(TABLES.ids.get(player)))
    return ctx.reply(`§c${player} is already banned`);
  new Ban(player, duration, reason, ctx.sender.name);
  ctx.reply(text["modules.commands.ban.reply"](player, duration, reason));
}

new Command({
  name: "ban",
  description: "Bans a player for lengths",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.playerName())
  .executes((ctx, player) => {
    ban(ctx, player, null, null, ctx.sender.name);
  })
  .argument(new ArgumentTypes.duration("duration"))
  .executes((ctx, player, duration) => {
    ban(ctx, player, duration, null, ctx.sender.name);
  })
  .string("reason")
  .executes((ctx, player, duration, reason) => {
    ban(ctx, player, duration, reason, ctx.sender.name);
  });
