import { world } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { Command, getChatAugments, getChatCommand } from "./Command";

export const COMMAND_PATHS: Array<Command> = [];

world.events.beforeChat.subscribe((data) => {
  try {
    if (!data.message.startsWith(PREFIX)) return;
    data.cancel = true;
    let args = getChatAugments(data);
    const command = getChatCommand(data);
    if (!command || !command.callback)
      // @ts-ignore
      return data.sender.tell({
        translate: `commands.generic.unknown`,
        with: [`§f${args[0]}§c`],
      });
    if (
      !command.tags.every((tag) => data.sender.hasTag(tag)) ||
      !command.hasPermission(data.sender)
    )
      return data.sender.tell(`You do not have permission to use this command`);
    args.shift();
    args = args.filter((el) => !command.path.includes(el)); // removes command and subcommands from path
    for (let [index, option] of command.options.entries()) {
      if (option.type == "location") {
        // @ts-ignore
        if (option.x.verify(args[index])) {
          // @ts-ignore
          if (args?.[index + 1] && option.y.verify(args[index + 1])) {
            // @ts-ignore
            if (args?.[index + 2] && option.z.verify(args[index + 2])) {
              continue;
            } else {
              index += 2;
            }
          } else {
            index += 1;
          }
        }
      } else {
        // @ts-ignore
        if (option.verify(args[index])) continue;
      }
      if (option.optional) break;
      // @ts-ignore
      return data.sender.tell({
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${command.path.join(" ")} ${args
            .slice(0, index)
            .join(" ")}`,
          args[index],
          args.slice(index + 1).join(" "),
        ],
      });
    }
    command.sendCallback(data, args);
  } catch (error) {
    console.warn(`${error} : ${error.stack}`);
    data.cancel = false;
  }
});
