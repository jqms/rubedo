import { PREFIX } from "../../config/commands.js";
import { CommandCallback } from "./Callback.js";
import { COMMAND_PATHS } from "./index.js";
import { CommandOption } from "./Options.js";
import { parseLocationAugs } from "./utils.js";
export const DEFAULT_HAS_PERMISSION = (player) => true;
export function getChatCommand(data) {
    const args = getChatAugments(data);
    let checker = (arr, target) => target.every((v, index) => v === arr[index]);
    let command = null;
    const cmds = {};
    for (const command of COMMAND_PATHS) {
        cmds[command.path.toString()] = command;
        for (const aliase of command.aliases) {
            let p = [...command.path];
            p[0] = aliase;
            cmds[p.toString()] = command;
        }
        if (command.path.length > 1) {
            const a = COMMAND_PATHS.find((cmd) => cmd.name == command.path[0]);
            for (const aliase of a.aliases) {
                let p = [...command.path];
                p[0] = aliase;
                cmds[p.toString()] = command;
            }
        }
    }
    for (let [path, cmd] of Object.entries(cmds)) {
        const pathA = path.split(",");
        if (checker(args, pathA))
            command = cmd;
    }
    return command;
}
export function getChatAugments(data) {
    return data.message
        .slice(PREFIX.length)
        .trim()
        .match(/"[^"]+"|[^\s]+/g)
        .map((e) => e.replace(/"(.+)"/, "$1").toString());
}
export class Command {
    constructor(CommandInfo, callback) {
        this.name = CommandInfo.name.toString().toLowerCase();
        this.description = CommandInfo.description;
        this.aliases = CommandInfo.aliases ?? [];
        this.tags = CommandInfo.tags ?? [];
        this.hasPermission = CommandInfo.hasPermission ?? DEFAULT_HAS_PERMISSION;
        this.path = CommandInfo.path ?? [this.name];
        this.permissions = CommandInfo.permissions ?? [];
        this.options = [];
        this.callback = callback;
        COMMAND_PATHS.push(this);
    }
    addSubCommand(SubCommandInfo, callback) {
        const newPath = [...this.path];
        newPath.push(SubCommandInfo.name);
        const subCommand = new Command({
            name: SubCommandInfo.name,
            description: SubCommandInfo.description,
            tags: SubCommandInfo.tags,
            hasPermission: SubCommandInfo.hasPermission,
            path: newPath,
        }, callback);
        return subCommand;
    }
    addOption(name, type, description, optional = false) {
        if (type == "location") {
            this.options.push({
                name: name,
                type: "location",
                description: description,
                optional: optional,
                x: new CommandOption(`x${Date.now()}`, type, description, optional),
                y: new CommandOption(`y${Date.now()}`, type, description, optional),
                z: new CommandOption(`z${Date.now()}`, type, description, optional),
            });
            return this;
        }
        this.options.push(new CommandOption(name, type, description, optional));
        return this;
    }
    getName() {
        return this.name;
    }
    sendCallback(data, args) {
        if (!this.callback)
            return;
        const options = {};
        for (const [i, option] of this.options.entries()) {
            if (option.type == "location") {
                options[option.name] = parseLocationAugs([args[i], args[i + 1], args[i + 2]], {
                    location: [
                        data.sender.location.x,
                        data.sender.location.y,
                        data.sender.location.z,
                    ],
                    viewVector: [
                        data.sender.viewVector.x,
                        data.sender.viewVector.y,
                        data.sender.viewVector.z,
                    ],
                });
                continue;
            }
            options[option.name] = option.validate(args[i]);
        }
        this.callback(new CommandCallback(data, args), options);
    }
    executes(callback) {
        this.callback = callback;
        return this;
    }
}
