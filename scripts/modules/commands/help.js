import { Command } from "../../lib/Commands/Command.js";
import { COMMAND_PATHS } from "../../lib/Commands/index.js";
new Command({
    name: "help",
    description: "Provides help/list of commands.",
    aliases: ["?", "h"],
}, (ctx) => {
    if (COMMAND_PATHS.length == 0)
        return ctx.reply(`No Commands Found`);
    const ALL_COMMANDS = COMMAND_PATHS.filter((command) => command.callback && command.hasPermission(ctx.sender));
    let page = 1;
    const maxPages = Math.ceil(ALL_COMMANDS.length / 10);
    const arg = ctx.args[0];
    if (arg) {
        if (!isNaN(parseInt(arg))) {
            page = parseInt(arg);
        }
        else {
            const cmd = ALL_COMMANDS.find((cmd) => cmd.path.includes(arg));
            if (!cmd)
                return ctx.reply(`The command ${arg} does not exist`);
            ctx.sender.tell({
                rawtext: [
                    //@ts-ignore
                    {
                        translate: `commands.help.command.aliases`,
                        with: [cmd.name, cmd.aliases.join(", ")],
                    },
                ],
            });
            ctx.reply(cmd.description);
            ctx.reply(`Usage: \n`);
            for (const command of ALL_COMMANDS.filter((c) => c.path[0] == ctx.args[0])) {
                const options = command.options.map((option) => `${option.optional ? "[" : "<"}${option.name}: ${option.type}${option.optional ? "]" : ">"}`);
                ctx.reply(`-${command.path.join(" ")} ${options.join(" ")}`);
            }
            return;
        }
    }
    if (page > maxPages)
        page = maxPages;
    ctx.sender.tell({
        rawtext: [
            //@ts-ignore
            {
                translate: `commands.help.header`,
                with: [page.toString(), maxPages.toString()],
            },
        ],
    });
    for (const command of ALL_COMMANDS.slice(page * 10 - 10, page * 10)) {
        const options = command.options.map((option) => `${option.optional ? "[" : "<"}${option.name}: ${option.type}${option.optional ? "]" : ">"}`);
        ctx.reply(`-${command.path.join(" ")} ${options.join(" ")}`);
    }
});
