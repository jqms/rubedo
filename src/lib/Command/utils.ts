import { Player } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { Command } from "./Command";

/**
 * Returns a Before chat events augments
 * @example this.getChatAugments(BeforeChatEvent)
 */
export function getChatAugments(
  message: string,
  prefix: string
): Array<string> {
  return message
    .slice(prefix.length)
    .trim()
    .match(/"[^"]+"|[^\s]+/g)
    .map((e) => e.replace(/"(.+)"/, "$1").toString());
}

/**
 * Sends a command not found message to a player
 * @param player player to send message to
 */
export function commandNotFound(player: Player, command: string) {
  player.tell({
    rawtext: [
      //@ts-ignore
      {
        translate: `commands.generic.unknown`,
        with: [`§f${command}§c`],
      },
    ],
  });
}

/**
 * Sends a syntax failure message to player
 * @param player
 * @param command
 * @param args
 * @param i
 */
export function commandSyntaxFail(
  player: Player,
  command: Command,
  args: string[],
  i: number
) {
  player.tell({
    rawtext: [
      //@ts-ignore
      {
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${command.data.name} ${args.slice(0, i).join(" ")}`,
          args[i] ?? " ",
          args.slice(i + 1).join(" "),
        ],
      },
    ],
  });
}
