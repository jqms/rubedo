import { Command } from "../../lib/Commands/Command.js";
import { getRole, setRole } from "../../utils.js";
const main = new Command({
    name: "role",
    description: "Changes role for a player",
    hasPermission: (player) => getRole(player) == "admin",
});
main
    .addSubCommand({
    name: "set",
    description: "Sets the role for a player",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("playerName", "string", "player to set")
    .addOption("role", ["member", "moderator", "admin"], "Role to set this player to")
    .executes((ctx, { playerName, role }) => {
    setRole(playerName, role);
    ctx.reply(`Changed role of ${playerName} to ${role}`);
});
main
    .addSubCommand({
    name: "get",
    description: "Gets the role of a player",
    hasPermission: (player) => getRole(player) == ("admin" || "moderator"),
})
    .addOption("playerName", "string", "player to set")
    .executes((ctx, { playerName }) => {
    ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
});
