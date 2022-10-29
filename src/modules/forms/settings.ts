import { ItemTypes, MinecraftBlockTypes, Player } from "@minecraft/server";
import { APPEAL_LINK } from "../../config/app";
import { ENCHANTMENTS } from "../../config/enchantments";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation";
import { TABLES } from "../../lib/Database/tables";
import { ModalForm } from "../../lib/Form/Models/ModelForm";

export function showPage1(player: Player) {
  new ModalForm("Manage Banned Items")
    .addDropdown("Add/Remove Item", ["add", "remove"] as const, 0)
    .addTextField("Item Id", "minecraft:string")
    .show(player, (ctx, method, id) => {
      if (!ItemTypes.get(id)?.id)
        return ctx.error(
          `§c"${id}" is not a vaild item id, note: this item must be either a item in a behavior pack or a default minecraft item`
        );
      if (method == "add") {
        // add item to list
        let items: Array<String> =
          TABLES.config.get("banned_items") ?? BANNED_ITEMS;
        if (items.includes(id))
          return ctx.error(`§cItem "${id}" is already banned`);
        items.push(id);
        TABLES.config.set("banned_items", items);
        player.tell(`Banned the item "${id}"`);
      } else {
        // remove item
        let items: string[] = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
        if (!items.includes(id))
          return ctx.error(`§cItem: "${id}" is not banned`);
        items = items.filter((p) => p != id);
        TABLES.config.set("banned_items", items);
        player.tell(`Removed Banned item "${id}"`);
      }
    });
}

export function showPage2(player: Player) {
  new ModalForm("Manage Banned Blocks")
    .addDropdown("Add/Remove Block", ["add", "remove"] as const, 0)
    .addTextField("Block Id", "minecraft:barrier")
    .show(player, (ctx, method, id) => {
      if (!MinecraftBlockTypes.get(id)?.id)
        return ctx.error(
          `§c"${id}" is not a vaild block id, note: this item must be either a block in a behavior pack or a default minecraft block`
        );
      if (method == "add") {
        // add item to list
        let blocks: string[] =
          TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
        if (blocks.includes(id))
          return ctx.error(`§cBlock "${id}" is already banned`);
        blocks.push(id);
        TABLES.config.set("banned_blocks", id);
        player.tell(`Banned the block "${id}"`);
      } else {
        // remove item
        let blocks: string[] =
          TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
        if (!blocks.includes(id))
          return ctx.error(`block: "${id}" is not banned`);
        blocks = blocks.filter((p) => p != id);
        TABLES.config.set("banned_blocks", id);
        player.tell(`Removed Banned block "${id}"`);
      }
    });
}

type MaxEnchantments = {
  [key: string]: number;
};

export function showPage3(player: Player) {
  new ModalForm("Manage Enchantment Levels")
    .addDropdown("Enchantment to change", Object.keys(ENCHANTMENTS), 0)
    .addTextField("Level (number)", "5")
    .show(player, (ctx, enchantment, levelstring) => {
      if (isNaN(levelstring as any))
        return ctx.error(
          `§c"${levelstring}" is not a number, please enter a value like, "3", "9", etc.`
        );
      const level = parseInt(levelstring);
      let enchants: MaxEnchantments =
        TABLES.config.get("enchantments") ?? ENCHANTMENTS;
      enchants[enchantment] = level;
      TABLES.config.set("enchantments", enchants);
      player.tell(`Set max level for ${enchantment} to ${level}`);
    });
}

export function showPage4(player: Player) {
  new ModalForm("Manage Appeal Link")
    .addTextField("Appeal Link", APPEAL_LINK)
    .show(player, (ctx, link) => {
      TABLES.config.set("appealLink", link);
      player.tell(`Changed the servers appeal link to ${link}`);
    });
}
