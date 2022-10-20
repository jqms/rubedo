import { world } from "mojang-minecraft";
import { Command } from "../../lib/Command/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "vanish",
  description: "Toggles Vanish Mode on the sender",
  requires: (player) => getRole(player) == "admin",
})
  .boolean("say")
  .executes((ctx, say) => {
    if (ctx.sender.hasTag(`spectator`)) {
      ctx.sender.runCommand(`gamemode c`);
      ctx.sender.runCommand(`event entity @s removeSpectator`);
      ctx.sender.removeTag(`spectator`);
      if (!say) return;
      world.say({
        rawtext: [
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
          {
            translate: "multiplayer.player.left",
            with: [`§e${ctx.sender.name}`],
          },
        ],
      });
    }
  });
