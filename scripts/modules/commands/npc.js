import { NPC_LOCATIONS } from "../../index.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command(
  {
    name: "npc",
    description: "Spawns a npc at your coordinates",
    hasPermission: (player) => getRole(player) == "admin",
  },
  (ctx) => {
    NPC_LOCATIONS.push(ctx.sender.location);
    ctx.sender.dimension.spawnEntity("minecraft:npc", ctx.sender.location);
    ctx.reply(`Spawned a verifed npc at your current location`);
  }
);
