import { text } from "../../lang/text.js";
import {
  IArgumentReturnData,
  IArgumentType,
} from "../../lib/Command/ArgumentTypes.js";
import type { CommandCallback } from "../../lib/Command/Callback.js";
import { Command, ArgumentTypes } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";

class PlayerNameArgumentType implements IArgumentType {
  type: string;
  typeName = "playerName";
  matches(value: string): IArgumentReturnData<string> {
    const player = TABLES.ids.get(value);
    return {
      success: player ? true : false,
      value: value,
    };
  }
  fail(value: string): string {
    return `player: "${value}" has never played this world before!`;
  }
  constructor(public name: string = "playerName") {
    this.name = name;
  }
}

function ban(
  ctx: CommandCallback,
  player: string,
  length: number,
  unit: string,
  reason: string,
  by: string
) {
  if (TABLES.bans.get(TABLES.ids.get(player)))
    return ctx.reply(`§c${player} is already banned`);
  new Ban(player, length, unit, reason, ctx.sender.name);
  ctx.reply(text["modules.commands.ban.reply"](player, length, unit, reason));
}

new Command({
  name: "ban",
  description: "Bans a player for lengths",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new PlayerNameArgumentType())
  .executes((ctx, player) => {
    ban(ctx, player, null, null, null, ctx.sender.name);
  })
  .argument(new ArgumentTypes.int("length"))
  .argument(new ArgumentTypes.unit("unit"))
  .executes((ctx, player, length, unit) => {
    ban(ctx, player, length, unit, null, ctx.sender.name);
  })
  .string("reason")
  .executes((ctx, player, length, unit, reason) => {
    ban(ctx, player, length, unit, reason, ctx.sender.name);
  });
