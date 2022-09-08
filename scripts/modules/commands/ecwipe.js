import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

new Command({
  name: "ecwipe",
  description: "Clears a players ender chest",
  hasPermission: (player) => getRole(player) == "admin",
})
  .addOption("player", "player", "Player to clear")
  .executes((ctx, { player }) => {
    for (let i = 0; i < 27; i++) {
      player.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
    }
    ctx.reply(`Cleared ${player.name} Ender chest!`);
  });
