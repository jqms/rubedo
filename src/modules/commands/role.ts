import { world } from "@minecraft/server";
import { ROLES } from "../../types";
import { ArgumentTypes, Command } from "../../lib/Command/Command";
import { getRole, setRole } from "../../utils.js";

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

const root = new Command({
  name: "role",
  description: "Changes the role for a player",
  requires: (player) =>
    getRole(player) == "admin" ||
    world.getDynamicProperty("worldsOwner") == player.id,
});

root
  .literal({
    name: "set",
    description: "Sets the role for a player",
  })
  .argument(new ArgumentTypes.playerName("playerName"))
  .argument(new ArgumentTypes.array("role", ToArray(ROLES) as string[]))
  .executes((ctx, playerName, role) => {
    setRole(playerName, role as keyof typeof ROLES);
    ctx.reply(`Changed role of ${playerName} to ${role}`);
  });

root
  .literal({
    name: "get",
    description: "Gets the role of a player",
  })
  .argument(new ArgumentTypes.playerName("playerName"))
  .executes((ctx, playerName) => {
    ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
  });
