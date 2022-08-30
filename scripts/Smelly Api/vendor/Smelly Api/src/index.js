import { Entity, InventoryComponentContainer, world } from "mojang-minecraft";
import { COMMAND_PATHS } from "../../../app/Contracts/Commands/Command.js";
import { items } from "../../../database/tables.js";
import { SA } from "../../../index.js";

new SA.Command(
  {
    name: "version",
    description: "Get Current Version",
    aliases: ["v"],
    permissions: ["SA.command.version"],
  },
  (ctx) => {
    ctx.reply(`Current Smelly API Version: ${SA.version}`);
  }
);

new SA.Command(
  {
    name: "test",
    description: "Test command",
  },
  (ctx) => {
    try {
      console.warn("Smelly API is workin and configured properly!");
      ctx.reply(`Smelly API is workin and configured properly!`);
    } catch (error) {
      console.warn(error + error.stack);
    }
  }
);

new SA.Command(
  {
    name: "ping",
    description: "Returns the current TPS of the servers ping",
  },
  (ctx) => {
    let pingTick = world.events.tick.subscribe(({ currentTick, deltaTime }) => {
      SA.Providers.chat.broadcast(`Pong! Current TPS: ${1 / deltaTime}`);
      world.events.tick.unsubscribe(pingTick);
    });
  }
);

new SA.Command(
  {
    name: "help",
    description: "Provides help/list of commands.",
    aliases: ["?", "h"],
  },
  (ctx) => {
    if (COMMAND_PATHS.length == 0) return ctx.reply(`No Commands Found`);
    const ALL_COMMANDS = COMMAND_PATHS.filter((command) => command.callback);
    let page = 1;
    const maxPages = Math.ceil(ALL_COMMANDS.length / 10);
    const arg = ctx.args[0];
    if (arg) {
      if (!isNaN(arg)) {
        page = parseInt(arg);
      } else {
        const cmd = ALL_COMMANDS.find((cmd) => cmd.path.includes(arg));
        if (!cmd) return ctx.reply(`The command ${arg} does not exist`);
        ctx.reply(`commands.help.command.aliases`, [
          cmd.name,
          cmd.aliases.join(", "),
        ]);
        ctx.reply(cmd.description);
        ctx.reply(`Usage: \n`);
        for (const command of ALL_COMMANDS.filter(
          (c) => c.path[0] == ctx.args[0]
        )) {
          const options = command.options.map(
            (option) =>
              `${option.optional ? "[" : "<"}${option.name}: ${option.type}${
                option.optional ? "]" : ">"
              }`
          );
          ctx.reply(`-${command.path.join(" ")} ${options.join(" ")}`);
        }
        return;
      }
    }
    if (page > maxPages) page = maxPages;
    ctx.reply(`commands.help.header`, [page, maxPages]);

    for (const command of ALL_COMMANDS.slice(page * 10 - 10, page * 10)) {
      const options = command.options.map(
        (option) =>
          `${option.optional ? "[" : "<"}${option.name}: ${option.type}${
            option.optional ? "]" : ">"
          }`
      );
      ctx.reply(`-${command.path.join(" ")} ${options.join(" ")}`);
    }
  }
);

const dbcm = new SA.Command({
  name: "database",
  description: "Interacts with SA Database",
  aliases: ["db"],
});

dbcm
  .addSubCommand({
    name: "get",
    tags: ["staff"],
  })
  .addOption("table", "string", "Table to grab from")
  .addOption("key", "string", "Key to grab")
  .executes((ctx, { table, key }) => {
    try {
      console.warn(JSON.stringify(SA.tables[table].MEMORY));
      const data = SA.tables[table].get(key);
      if (data) {
        ctx.reply(data);
      } else {
        ctx.reply(`No data could be found for key ${key}`);
      }
    } catch (error) {
      ctx.reply(error + error.stack);
    }
  });

dbcm
  .addSubCommand({
    name: "set",
    tags: ["staff"],
  })
  .addOption("table", "string", "Table to set to")
  .addOption("key", "string", "Key to set")
  .addOption("value", "string", "Value to assign to the key")
  .executes((ctx, { table, key, value }) => {
    try {
      SA.tables[table].set(key, value);
      ctx.reply(`Set Key: "${key}", to value: "${value}" on table: "${table}"`);
    } catch (error) {
      ctx.reply(error + error.stack);
    }
  });

dbcm
  .addSubCommand({
    name: "clear",
    tags: ["staff"],
  })
  .addOption("table", "string", "Table to set to")
  .executes((ctx, { table }) => {
    try {
      SA.tables[table].clear();
      ctx.reply(`Cleared Table ${table}`);
    } catch (error) {
      ctx.reply(error + error.stack);
    }
  });

const itemdb = new SA.Command({
  name: "itemdatabase",
  description: "Interacts with SA Item Database",
  aliases: ["itemdb"],
});

itemdb.addSubCommand(
  {
    name: "savehand",
    tags: ["staff"],
  },
  (ctx) => {
    const item = SA.Models.entity.getHeldItem(ctx.sender);
    if (!item) return ctx.reply(`You are not holding a item`);
    const key = items.add(item);
    return ctx.reply(`${item.id} has been saved to a id of "${key}"`);
  }
);

itemdb
  .addSubCommand({
    name: "get",
    tags: ["staff"],
  })
  .addOption(`id`, "string", "The id of the saved item")
  .executes((ctx, { id }) => {
    const item = items.get(id);
    if (!item)
      return ctx.reply(`No item found with the id of "${id}" is saved`);
    /**
     * @type {InventoryComponentContainer}
     */
    const inv = ctx.sender.getComponent("minecraft:inventory").container;
    inv.addItem(item);
    return ctx.reply(`Gave item ${item.id}`);
  });
