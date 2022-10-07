import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command(
  {
    name: "spectate",
    description: "Toggles Spectater Mode on the sender",
    hasPermission: (player) => getRole(player) == "admin",
  },
  (ctx) => {
    if (ctx.sender.hasTag(`spectator`)) {
      ctx.sender.runCommand(`gamemode c`);
      ctx.sender.runCommand(`event entity @s removeSpectator`);
      ctx.sender.removeTag(`spectator`);
    } else {
      ctx.sender.runCommand(`gamemode spectator`);
      ctx.sender.runCommand(`event entity @s addSpectator`);
      ctx.sender.addTag(`spectator`);
    }
  }
);
