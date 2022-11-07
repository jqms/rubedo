import { world } from "@minecraft/server";
import { text } from "../../lang/text.js";
import { Command } from "../../lib/Command/Command.js";
import { getRole, isLockedDown, kick, setLockDown } from "../../utils.js";

new Command({
  name: "lockdown",
  description: "Toggles the servers lockdown, meaning noone can join",
  requires: (player) => getRole(player) == "admin",
}).executes((ctx) => {
  if (isLockedDown()) {
    setLockDown(false);
    ctx.sender.tell(`Unlocked the server!`);
  } else {
    setLockDown(true);
    for (const player of world.getPlayers()) {
      if (getRole(player) == "admin") continue;
      kick(player, text["lockdown.kick.message"]());
    }
    ctx.sender.tell(`Locked down the server, no one can join`);
  }
});
