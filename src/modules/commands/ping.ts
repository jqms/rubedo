import { Command } from "../../lib/Command/Command.js";
import { world } from "@minecraft/server";

new Command({
  name: "ping",
  description: "Returns the current TPS of the servers ping",
}).executes((ctx) => {
  let pingTick = world.events.tick.subscribe(({ deltaTime }) => {
    ctx.reply(`Pong! Current TPS: ${1 / deltaTime}`);
    world.events.tick.unsubscribe(pingTick);
  });
});
