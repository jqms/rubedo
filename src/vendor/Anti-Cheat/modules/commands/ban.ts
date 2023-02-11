import { TABLES } from "../../tables.js";
import { msToTime } from "../../../../utils.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";
import { confirmAction } from "../../../../rubedo/lib/Form/utils.js";
import {
  ArgumentTypes,
  Command,
} from "../../../../rubedo/lib/Command/Command.js";
import { text } from "../../../../rubedo/lang/text.js";
import type { CommandCallback } from "../../../../rubedo/lib/Command/Callback.js";

function ban(
  ctx: CommandCallback,
  player: string,
  duration: string,
  reason: string,
  by: string
) {
  if (TABLES.bans.get(TABLES.ids.get(player)))
    return ctx.reply(`§c${player} is already banned`);
  ctx.reply(`§aClose chat to confirm`);
  confirmAction(
    ctx.sender,
    `Are you sure you want to ban ${player}, for ${duration ?? "forever"}`,
    () => {
      new Ban(player, duration, reason, ctx.sender.name);
      ctx.reply(text["modules.commands.ban.reply"](player, duration, reason));
    }
  );
}

const root = new Command({
  name: "ban",
  description: "Manage bans",
  requires: (player) => ["admin", "moderator"].includes(getRole(player)),
});

root
  .literal({
    name: "add",
    description: "Bans a player",
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

root
  .literal({
    name: "remove",
    description: "un-bans a player",
  })
  .argument(new ArgumentTypes.playerName("playerName"))
  .executes((ctx, playerName) => {
    const banData = TABLES.bans
      .values()
      .find((ban) => ban.playerName == playerName);
    if (!banData) return ctx.reply(`${playerName} is not banned`);
    if (TABLES.bans.delete(banData.key)) {
      ctx.reply(`§a${playerName}§r has been Unbanned!`);
    } else {
      ctx.reply(`§cFailed to un-ban ${playerName}`);
    }
  });

root
  .literal({
    name: "list",
    description: "Lists all bans",
  })
  .executes((ctx) => {
    const bans = TABLES.bans.values();
    if (bans.length == 0) return ctx.sender.tell(`§cNo one is banned!`);
    ctx.sender.tell(`§2--- Showing Bans (${bans.length}) ---`);
    for (const ban of bans) {
      ctx.sender.tell(
        text["commands.ban.list.player"](
          ban.playerName,
          ban.reason,
          ban.expire ? msToTime(ban.duration) : "Forever"
        )
      );
    }
  });