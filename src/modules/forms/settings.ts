import { MinecraftBlockTypes, Player } from "@minecraft/server";
import { APPEAL_LINK } from "../../config/app";
import { ENCHANTMENTS } from "../../config/enchantments";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation";
import { TABLES } from "../../lib/Database/tables";
import { ActionForm } from "../../lib/Form/Models/ActionForm";
import { ModalForm } from "../../lib/Form/Models/ModelForm";

export function showPage1Home(player: Player) {
  new ActionForm("Remove a Banned Item")
    .addButton("Remove a Banned Item", null, () => {
      showPage1Sub1(player);
    })
    .addButton("Ban an item", null, () => {
      showPage1Sub2(player);
    })
    .show(player);
}
export function showPage1Sub1(player: Player) {
  new ModalForm("Remove Banned Items")
    .addDropdown(
      "Select item to remove",
      TABLES.config.get("banned_items") ?? BANNED_ITEMS
    )
    .show(player, (ctx, item) => {
      let items: string[] = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
      items = items.filter((p) => p != item);
      TABLES.config.set("banned_items", items);
      player.tell(`Removed Banned item "${item}"`);
    });
}

export function showPage1Sub2(player: Player) {
  new ModalForm("Add Banned Items")
    .addTextField("Item Id", "minecraft:string")
    .show(player, (ctx, item) => {
      let items: Array<String> =
        TABLES.config.get("banned_items") ?? BANNED_ITEMS;
      if (items.includes(item))
        return ctx.error(`§cItem "${item}" is already banned`);
      items.push(item);
      TABLES.config.set("banned_items", items);
      player.tell(`Banned the item "${item}"`);
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
