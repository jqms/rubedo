import { Command } from "../../lib/Commands/Command.js";
import { world } from "mojang-minecraft";

new Command(
  {
    name: "ping",
    description: "Returns the current TPS of the servers ping",
  },
  (ctx) => {
    let pingTick = world.events.tick.subscribe(({ deltaTime }) => {
      ctx.reply(`Pong! Current TPS: ${1 / deltaTime}`);
      world.events.tick.unsubscribe(pingTick);
    });
  }
);
