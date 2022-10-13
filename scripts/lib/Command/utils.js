import { PREFIX } from "../../config/commands";
export function getChatAugments(message, prefix) {
    return message
        .slice(prefix.length)
        .trim()
        .match(/"[^"]+"|[^\s]+/g)
        .map((e) => e.replace(/"(.+)"/, "$1").toString());
}
export function commandNotFound(player, command) {
    player.tell({
        rawtext: [
            {
                translate: `commands.generic.unknown`,
                with: [`§f${command}§c`],
            },
        ],
    });
}
export function commandSyntaxFail(player, command, args, i) {
    player.tell({
        rawtext: [
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
