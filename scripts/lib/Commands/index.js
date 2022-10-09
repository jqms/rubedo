import { world } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { getChatAugments, getChatCommand } from "./Command";
export const COMMAND_PATHS = [];
world.events.beforeChat.subscribe((data) => {
    try {
        if (!data.message.startsWith(PREFIX))
            return;
        data.cancel = true;
        let args = getChatAugments(data);
        const command = getChatCommand(data);
        if (!command || !command.callback)
            return data.sender.tell({
                rawtext: [
                    {
                        translate: `commands.generic.unknown`,
                        with: [`§f${args[0]}§c`],
                    },
                ],
            });
        if (!command.tags.every((tag) => data.sender.hasTag(tag)) ||
            !command.hasPermission(data.sender))
            return data.sender.tell(`You do not have permission to use this command`);
        args.shift();
        args = args.filter((el) => !command.path.includes(el));
        for (let [index, option] of command.options.entries()) {
            if (option.type == "location") {
                if (option.x.verify(args[index])) {
                    if (args?.[index + 1] && option.y.verify(args[index + 1])) {
                        if (args?.[index + 2] && option.z.verify(args[index + 2])) {
                            continue;
                        }
                        else {
                            index += 2;
                        }
                    }
                    else {
                        index += 1;
                    }
                }
            }
            else {
                if (option.verify(args[index]))
                    continue;
            }
            if (option.optional)
                break;
            return data.sender.tell({
                rawtext: [
                    {
                        translate: `commands.generic.syntax`,
                        with: [
                            `${PREFIX}${command.path.join(" ")} ${args
                                .slice(0, index)
                                .join(" ")}`,
                            args[index] ?? " ",
                            args.slice(index + 1).join(" "),
                        ],
                    },
                ],
            });
        }
        command.sendCallback(data, args);
    }
    catch (error) {
        console.warn(`${error} : ${error.stack}`);
        data.cancel = false;
    }
});
