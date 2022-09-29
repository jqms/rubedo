import { COMMANDS } from "../../config/commands.js";
import { ENCHANTMENTS } from "../../config/enchantments.js";
import { MANAGERS } from "../../config/managers.js";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation.js";
import { PROTECTIONS } from "../../config/protections.js";
import { TABLES } from "../../index.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";

/**
 * Enables a value on a db key
 */
function enable(v: string, db_key: string, defaultValues: string[] = []) {
  /**
   * @type {Array<String>}
   */
  let values = TABLES.config.get(db_key) ?? defaultValues;
  if (!values.includes(v)) values.push(v);
  TABLES.config.set(db_key, values);
}

/**
 * Disables a value on a db key
 */
function disable(v: string, db_key: string, defaultValues: string[] = []) {
  let values: string[] = TABLES.config.get(db_key) ?? defaultValues;
  values = values.filter((p) => p != v);
  TABLES.config.set(db_key, values);
}

const CONFIGURATIONS = [
  {
    name: "Protection",
    db_key: "protections",
    configValue: PROTECTIONS,
  },
  {
    name: "Command",
    db_key: "commands",
    configValue: COMMANDS,
  },
  {
    name: "Mangaer",
    db_key: "managers",
    configValue: MANAGERS,
  },
];

const config = new Command({
  name: "config",
  description: "Opens up a form to configure rubedo",
  hasPermission: (player) => getRole(player) == "admin",
});

for (const configer of CONFIGURATIONS) {
  const cmd = config.addSubCommand({
    name: configer.db_key,
    description: `Change the config for ${configer.name}`,
  });
  cmd
    .addSubCommand({
      name: "enable",
      description: `Enables a ${configer.name}`,
      hasPermission: (player) => getRole(player) == "admin",
    })
    .addOption(`value`, configer.configValue, `${configer.name} to enable`)
    .executes((ctx, { value }: { value: string }) => {
      enable(value, configer.db_key, configer.configValue);
      ctx.reply(`Enabled ${configer.name} ${value}, run /reload in chat!`);
    });

  cmd
    .addSubCommand({
      name: "disable",
      description: `Disables a ${configer.name}`,
      hasPermission: (player) => getRole(player) == "admin",
    })
    .addOption("value", configer.configValue, `${configer.name} to disable`)
    .executes((ctx, { value }: { value: string }) => {
      disable(value, configer.db_key, configer.configValue);
      ctx.reply(`Disabled ${configer.name} ${value}, run /reload in chat!`);
    });

  cmd
    .addSubCommand({
      name: "list",
      description: `Lists all the ${configer.name}'s active`,
      hasPermission: (player) => getRole(player) == "admin",
    })
    .executes((ctx) => {
      let values = TABLES.config.get(configer.db_key) ?? configer.configValue;
      ctx.reply(`Active ${configer.name}'s ${values}`);
    });
}

const banned = config.addSubCommand({
  name: "banned",
  description: "Manages banned items/blocks on this server",
  hasPermission: (player) => getRole(player) == "admin",
});

const bannedItems = banned.addSubCommand({
  name: "items",
  description: "Manages the banned items on this server",
  hasPermission: (player) => getRole(player) == "admin",
});

bannedItems
  .addSubCommand({
    name: "add",
    description: "Adds a item to the banned items list",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("item", "string", "item to add make sure it is prefix:item")
  .executes((ctx, { item }: { item: string }) => {
    /**
     * @type {Array<String>}
     */
    let items = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (!items.includes(item)) items.push(item);
    TABLES.config.set("banned_items", items);
    ctx.reply(`Banned the item "${item}"`);
  });

bannedItems
  .addSubCommand({
    name: "remove",
    description: "Removes a item from the banned items list",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("item", "string", "item to remove make sure it is prefix:item")
  .executes((ctx, { item }: { item: string }) => {
    let items: string[] = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (!items.includes(item))
      return ctx.reply(`item: "${item}" is not banned`);
    items = items.filter((p) => p != item);
    TABLES.config.set("banned_items", items);
    ctx.reply(`Removed Banned item "${item}"`);
  });

const bannedBlocks = banned.addSubCommand({
  name: "blocks",
  description: "Manages the banned blocks on this server",
  hasPermission: (player) => getRole(player) == "admin",
});

bannedBlocks
  .addSubCommand({
    name: "add",
    description: "Adds a block to the banned blocks list",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("block", "string", "item to add make sure it is prefix:block")
  .executes((ctx, { block }: { block: string }) => {
    let blocks: string[] = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
    if (!blocks.includes(block)) blocks.push(block);
    TABLES.config.set("banned_blocks", block);
    ctx.reply(`Banned the block "${block}"`);
  });

bannedBlocks
  .addSubCommand({
    name: "remove",
    description: "Removes a block from the banned blocks list",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("block", "string", "block to remove make sure it is prefix:block")
  .executes((ctx, { block }: { block: string }) => {
    let blocks: string[] = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
    if (!blocks.includes(block))
      return ctx.reply(`block: "${block}" is not banned`);
    blocks = blocks.filter((p) => p != block);
    TABLES.config.set("banned_blocks", block);
    ctx.reply(`Removed Banned block "${block}"`);
  });

const enchantments = config.addSubCommand({
  name: "enchantments",
  description: "Manages the maxEnchants on this srrver",
  hasPermission: (player) => getRole(player) == "admin",
});

enchantments
  .addSubCommand({
    name: "set",
    description: "Sets a enchantment to a level",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("enchantment", Object.keys(ENCHANTMENTS), "enchantment to change")
  .addOption("level", "int", "Max level to change the enchantment to")
  .executes(
    (ctx, { enchantment, level }: { enchantment: string; level: number }) => {
      /**
       * @type {Array<String>}
       */
      let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
      enchants[enchantment] = level;
      TABLES.config.set("enchantments", enchants);
      ctx.reply(`Set max level for ${enchantment} to ${level}`);
    }
  );

enchantments
  .addSubCommand({
    name: "get",
    description: "Gets the max level for a enchantment",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("enchantment", Object.keys(ENCHANTMENTS), "enchantment to change")
  .executes((ctx, { enchantment }: { enchantment: string }) => {
    /**
     * @type {Array<String>}
     */
    let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    ctx.reply(`Max level for ${enchantment} is ${enchants[enchantment]}`);
  });

config
  .addSubCommand({
    name: "setAppealLink",
    description: "Sets the appeal link for this server",
    hasPermission: (player) => getRole(player) == "admin",
  })
  .addOption("link", "string", "the link to have people go to, to appeal")
  //@ts-ignore
  .executes((ctx, { link }) => {
    TABLES.config.set("appealLink", link);
    ctx.reply(`Changed the servers appeal link to ${link}`);
  });
