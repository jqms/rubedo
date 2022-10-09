import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";
import { Npc } from "../models/Npc.js";
new Command({
    name: "npc",
    description: "Spawns a npc at your coordinates",
    hasPermission: (player) => getRole(player) == "admin",
}, (ctx) => {
    new Npc(ctx.sender.location, ctx.sender.dimension);
    ctx.reply(`Spawned a verifed npc at your current location`);
});
