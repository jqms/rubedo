import { world } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { Command } from "./Command";
import { commandNotFound, commandSyntaxFail, getChatAugments } from "./utils";

/**
 * An array of all active commands
 */
export const COMMANDS: Command<any>[] = [];

world.events.beforeChat.subscribe((data) => {
  if (!data.message.startsWith(PREFIX)) return; // This is not a command
  data.cancel = true;
  const args = getChatAugments(data.message, PREFIX);
  const command = COMMANDS.find((c) => c.data.name == args[0]);
  if (!command) return commandNotFound(data.sender, args[0]);
  args.shift(); // Remove first command so we can look at args
  // Check Args/SubCommands for errors
  for (const [i, arg] of command.args.entries()) {
    if (arg.validate(args[i])) continue; // Arg is good

    return commandSyntaxFail(data.sender, command, args, i);
  }

  // Found command
  command.callback();
});
