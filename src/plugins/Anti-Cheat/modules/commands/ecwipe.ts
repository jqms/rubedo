import { ArgumentTypes, Command } from "../../../../lib/Command/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "ecwipe",
  description: "Clears a players ender chest",
  requires: (player) => getRole(player) == "admin",
})
  .argument(new ArgumentTypes.player("player"))
  .executes(async (ctx, player) => {
    for (let i = 0; i < 27; i++) {
      await player.runCommandAsync(
        `replaceitem entity @s slot.enderchest ${i} air`
      );
    }
    ctx.reply(`Cleared ${player.name} Ender chest!`);
  });
