import { world } from "mojang-minecraft";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "vanish",
  description: "Toggles Vanish Mode on the sender",
  hasPermission: (player) => getRole(player) == "admin",
})
  .addOption("say", "boolean", "if say you left/joined", true)
  // @ts-ignore
  .executes((ctx, { say }) => {
    if (ctx.sender.hasTag(`spectator`)) {
      ctx.sender.runCommand(`gamemode c`);
      ctx.sender.runCommand(`event entity @s removeSpectator`);
      ctx.sender.removeTag(`spectator`);
      if (!say) return;
      world.say({
        rawtext: [
          // @ts-ignore
          {
            translate: "multiplayer.player.joined",
            with: [`§e${ctx.sender.name}`],
          },
        ],
      });
    } else {
      ctx.sender.runCommand(`gamemode spectator`);
      ctx.sender.runCommand(`event entity @s addSpectator`);
      ctx.sender.addTag(`spectator`);
      if (!say) return;
      world.say({
        rawtext: [
          // @ts-ignore
          {
            translate: "multiplayer.player.left",
            with: [`§e${ctx.sender.name}`],
          },
        ],
      });
    }
  });
