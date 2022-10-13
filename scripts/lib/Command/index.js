import { world } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { commandNotFound, commandSyntaxFail, getChatAugments } from "./utils";
export const COMMANDS = [];
world.events.beforeChat.subscribe((data) => {
    if (!data.message.startsWith(PREFIX))
        return;
    data.cancel = true;
    const args = getChatAugments(data.message, PREFIX);
    const command = COMMANDS.find((c) => c.data.name == args[0]);
    if (!command)
        return commandNotFound(data.sender, args[0]);
    args.shift();
    for (const [i, arg] of command.args.entries()) {
        if (arg.validate(args[i]))
            continue;
        return commandSyntaxFail(data.sender, command, args, i);
    }
    command.callback();
});
