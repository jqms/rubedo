import { text } from "../../lang/text.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";

new Command({
  name: "ban",
  description: "Ban players for lengths",
  hasPermission: (player) => getRole(player) == "admin",
})
  .addOption("player", "player", "Player to ban")
  .addOption("length", "int", "Time ammount to ban", true)
  .addOption("unit", "string", "The unit for the time", true)
  .addOption("reason", "string", "reason for ban", true)
  // @ts-ignore
  .executes((ctx, { player, length, unit, reason }) => {
    console.warn(`hey`)
    try {
      new Ban(player, length, unit, reason, ctx.sender.name);
      ctx.reply(
        text["modules.commands.ban.reply"](
          player.name,
          length ?? "",
          unit ?? "",
          reason ?? ""
        )
      );
    } catch (error) {
      console.warn(error + error.stack);
    }
  });
