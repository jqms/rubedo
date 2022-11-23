import { MinecraftBlockTypes, Player } from "@minecraft/server";
import { APPEAL_LINK } from "../../config/app";
import { ENCHANTMENTS } from "../../config/enchantments";
import { TABLES } from "../../lib/Database/tables";
import { ActionForm } from "../../lib/Form/Models/ActionForm";
import { ModalForm } from "../../lib/Form/Models/ModelForm";
import { getConfigId } from "../../utils";

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
    .addDropdown("Select item to remove", getConfigId("banned_items"))
    .show(player, (ctx, item) => {
      let items = getConfigId("banned_items");
      items = items.filter((p) => p != item);
      TABLES.config.set("banned_items", items);
      player.tell(`Removed Banned item "${item}"`);
    });
}

export function showPage1Sub2(player: Player) {
  new ModalForm("Add Banned Items")
    .addTextField("Item Id", "minecraft:string")
    .show(player, (ctx, item) => {
      let items = getConfigId("banned_items");
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
        let blocks = getConfigId("banned_blocks");
        if (blocks.includes(id))
          return ctx.error(`§cBlock "${id}" is already banned`);
        blocks.push(id);
        TABLES.config.set("banned_blocks", id);
        player.tell(`Banned the block "${id}"`);
      } else {
        // remove item
        let blocks = getConfigId("banned_blocks");
        if (!blocks.includes(id))
          return ctx.error(`block: "${id}" is not banned`);
        blocks = blocks.filter((p) => p != id);
        TABLES.config.set("banned_blocks", id);
        player.tell(`Removed Banned block "${id}"`);
      }
    });
}

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
      let enchants = getConfigId("enchantments");
      enchants[enchantment as keyof typeof ENCHANTMENTS] = level;
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
