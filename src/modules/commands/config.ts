import { ENCHANTMENTS } from "../../config/enchantments.js";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation.js";
import { Command } from "../../lib/Command/Command.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getRole } from "../../utils.js";

type MaxEnchantments = {
  [key: string]: number;
};

const config = new Command({
  name: "config",
  description: "Opens up a form to configure rubedo",
  requires: (player) => getRole(player) == "admin",
});

const banned = config.literal({
  name: "banned",
  description: "Manages banned items/blocks on this server",
});

const bannedItems = banned.literal({
  name: "items",
  description: "Manages the banned items on this server",
});

bannedItems
  .literal({
    name: "add",
    description: "Adds a item to the banned items list",
  })
  .string("item")
  .executes((ctx, item) => {
    let items: Array<String> =
      TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (!items.includes(item)) items.push(item);
    TABLES.config.set("banned_items", items);
    ctx.reply(`Banned the item "${item}"`);
  });

bannedItems
  .literal({
    name: "remove",
    description: "Removes a item from the banned items list",
  })
  .string("item")
  .executes((ctx, item) => {
    let items: string[] = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (!items.includes(item))
      return ctx.reply(`item: "${item}" is not banned`);
    items = items.filter((p) => p != item);
    TABLES.config.set("banned_items", items);
    ctx.reply(`Removed Banned item "${item}"`);
  });

const bannedBlocks = banned.literal({
  name: "blocks",
  description: "Manages the banned blocks on this server",
});

bannedBlocks
  .literal({
    name: "add",
    description: "Adds a block to the banned blocks list",
  })
  .string("block")
  .executes((ctx, block) => {
    let blocks: string[] = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
    if (!blocks.includes(block)) blocks.push(block);
    TABLES.config.set("banned_blocks", block);
    ctx.reply(`Banned the block "${block}"`);
  });

bannedBlocks
  .literal({
    name: "remove",
    description: "Removes a block from the banned blocks list",
  })
  .string("block")
  .executes((ctx, block) => {
    let blocks: string[] = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
    if (!blocks.includes(block))
      return ctx.reply(`block: "${block}" is not banned`);
    blocks = blocks.filter((p) => p != block);
    TABLES.config.set("banned_blocks", block);
    ctx.reply(`Removed Banned block "${block}"`);
  });

const enchantments = config.literal({
  name: "enchantments",
  description: "Manages the maxEnchants on this srrver",
});

enchantments
  .literal({
    name: "set",
    description: "Sets a enchantment to a level",
  })
  .array("enchantment", Object.keys(ENCHANTMENTS))
  .int("level")
  .executes((ctx, enchantment, level) => {
    let enchants: MaxEnchantments =
      TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    enchants[enchantment] = level;
    TABLES.config.set("enchantments", enchants);
    ctx.reply(`Set max level for ${enchantment} to ${level}`);
  });

enchantments
  .literal({
    name: "get",
    description: "Gets the max level for a enchantment",
  })
  .array("enchantment", Object.keys(ENCHANTMENTS))
  .executes((ctx, enchantment) => {
    let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    ctx.reply(`Max level for ${enchantment} is ${enchants[enchantment]}`);
  });

config
  .literal({
    name: "setAppealLink",
    description: "Sets the appeal link for this server",
  })
  .string("link")
  .executes((ctx, link) => {
    TABLES.config.set("appealLink", link);
    ctx.reply(`Changed the servers appeal link to ${link}`);
  });
