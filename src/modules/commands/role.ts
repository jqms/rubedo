import { world } from "mojang-minecraft";
import { ROLES } from "../../types";
import { Command } from "../../lib/Commands/Command.js";
import { getId, getRole, setRole } from "../../utils.js";

// Helper
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
function ToArray(enumme: any) {
  return (
    Object.keys(enumme)
      // @ts-ignore
      .filter(StringIsNumber)
      .map((key) => enumme[key])
  );
}

const main = new Command({
  name: "role",
  description: "Changes role for a player",
  hasPermission: (player) =>
    getRole(player) == "admin" ||
    world.getDynamicProperty("worldsOwner") == getId(player),
});

main
  .addSubCommand({
    name: "set",
    description: "Sets the role for a player",
    hasPermission: (player) =>
      getRole(player) == "admin" ||
      world.getDynamicProperty("worldsOwner") == getId(player),
  })
  .addOption("playerName", "string", "player to set")
  .addOption("role", ToArray(ROLES), "Role to set this player to")
  // @ts-ignore
  .executes((ctx, { playerName, role }) => {
    setRole(playerName, role);
    ctx.reply(`Changed role of ${playerName} to ${role}`);
  });

main
  .addSubCommand({
    name: "get",
    description: "Gets the role of a player",
    hasPermission: (player) =>
      getRole(player) == "admin" ||
      world.getDynamicProperty("worldsOwner") == getId(player),
  })
  .addOption("playerName", "string", "player to set")
  .executes((ctx, { playerName }: { playerName: string }) => {
    ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
  });
