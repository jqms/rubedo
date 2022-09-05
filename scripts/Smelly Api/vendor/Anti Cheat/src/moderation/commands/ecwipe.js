import { SA } from "../../../../../index.js";
import { Freeze } from "../../Models/Freeze.js";
import { getRole } from "../../utils.js";

new SA.Command({
  name: "ecwipe",
  description: "Clears a players ender chest",
  hasPermission: (player) => getRole(player.name) == "admin",
})
  .addOption("player", "player", "Player to clear")
  .executes((ctx, { player }) => {
    for (let i = 0; i < 27; i++) {
      player.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
    }
    ctx.reply(`Cleared ${player.name} Ender chest!`);
  });
