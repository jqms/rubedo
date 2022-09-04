import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Ban } from "../../Models/Ban.js";

new SA.Command(
  {
    name: "spectate",
    description: "Toggles Spectater Mode on the sender",
    tags: [STAFF_TAG],
  },
  (ctx) => {
    if (ctx.sender.hasTag(`spectator`)) {
      ctx.sender.runCommand(`gamemode c`);
      ctx.sender.runCommand(`event entity @s removeSpectator`);
      ctx.sender.removeTag(`spectator`);
    } else {
      ctx.sender.runCommand(`gamemode spectator`);
      ctx.sender.runCommand(`event entity @s addSpectator`);
      ctx.sender.addTag(`spectator`);
    }
  }
);
