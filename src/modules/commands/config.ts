import { ENCHANTMENTS } from "../../config/enchantments.js";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation.js";
import { Command } from "../../lib/Commands/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

type MaxEnchantments = {
  [key: string]: number;
};

const config = new Command({
  name: "config",
  description: "Opens up a form to configure rubedo",
  hasPermission: (player) => getRole(player) == "admin",
});

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
    let items: Array<String> =
      TABLES.config.get("banned_items") ?? BANNED_ITEMS;
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
      let enchants: MaxEnchantments =
        TABLES.config.get("enchantments") ?? ENCHANTMENTS;
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
