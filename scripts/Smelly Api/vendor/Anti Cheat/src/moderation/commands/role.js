import { SA } from "../../../../../index.js";
import { getRole, setRole } from "../../utils.js";

const main = new SA.Command({
  name: "role",
  description: "Changes role for a player",
  hasPermission: (player) => getRole(player.name) == "admin",
});

main
  .addSubCommand({
    name: "set",
    description: "Sets the role for a player",
    hasPermission: (player) => getRole(player.name) == "admin",
  })
  .addOption("player", "player", "player to set")
  .addOption(
    "role",
    ["member", "moderator", "admin"],
    "Role to set this player to"
  )
  .executes((ctx, { player, role }) => {
    setRole(player.name, role);
    ctx.reply(`Changed role of ${player.name} to ${role}`);
  });

main
  .addSubCommand({
    name: "get",
    description: "Gets the role of a player",
    hasPermission: (player) => getRole(player.name) == "admin" || "moderator",
  })
  .addOption("player", "player", "player to set")
  .executes((ctx, { player }) => {
    ctx.reply(`${player.name} has role: ${getRole(player.name)}`);
  });
