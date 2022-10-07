import {
  Entity,
  InventoryComponentContainer,
  ItemStack,
  MinecraftItemTypes,
  PlayerInventoryComponentContainer,
  world,
} from "mojang-minecraft";
import { AIR } from "../../index.js";
import { BackButton, CloseGuiButton } from "../../lib/Chest GUI/Models/Buttons";
import { Item } from "../../lib/Chest GUI/Models/Item";
import { Page } from "../../lib/Chest GUI/Models/Page";

/**
 * The possible fillibale slots where items can be put
 * this is for inventory fill
 */
const FILLABLE_SLOTS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44,
];

/**
 * The possible fillibale slots where items can be put
 * this is for inventory fill
 */
const FILLABLE_SLOTS_ENDERCHEST = [
  10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32,
  33, 34, 37, 38, 39, 40, 41, 42, 43,
];

/**
 * Fills the chest Screen with the desired kit
 */
export function ViewPlayersFill(entity: Entity, page: Page, extras: any) {
  /**
   * @type {InventoryComponentContainer}
   */
  const container = entity.getComponent("minecraft:inventory").container;

  for (let i = 0; i < container.size; i++) {
    /**
     * @type {import("../../lib/Chest GUI/Models/Page").Slot}
     */
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  for (const [i, player] of [...world.getPlayers()].entries()) {
    const slot = FILLABLE_SLOTS[i];
    const item = new Item("minecraft:skull", 1, 3, { nameTag: player.name });
    container.setItem(slot, item.setComponents());
    page.slots[slot] = {
      item: item,
      action: (ctx) => {
        ctx.PageAction("moderation:see_inventory", { name: player.name });
      },
    };
  }
}

/**
 * Fills the chest Screen with the desired kit
 */
export function ViewPlayerInventoryFill(
  entity: Entity,
  page: Page,
  extras: any
) {
  const container = entity.getComponent("minecraft:inventory").container;

  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  const EnderChestItem = new Item("minecraft:ender_chest", 1, 0, {
    nameTag: `§eView §f${extras?.name}§e Ender Chest\n§fNote: §cThis will not grab §lANY NBT!§r`,
  });
  container.setItem(49, EnderChestItem.setComponents());
  page.slots[49] = {
    item: EnderChestItem,
    action: (ctx) => {
      ctx.PageAction("moderation:see_ender_chest", { name: extras.name });
    },
  };
  const player = [...world.getPlayers()].find((p) => p.name == extras.name);
  if (!player) return;
  const inventory = player.getComponent("inventory").container;
  /**
   * the value of how many slots have been taken
   */
  let used_slots = 0;
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (!item) continue;
    const slot = FILLABLE_SLOTS[used_slots];
    used_slots++;
    container.setItem(slot, item);
    page.slots[slot] = {
      item: new Item(item.id, item.amount, item.data, null, item),
      action: (ctx) => {
        if (i < 9) {
          player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`);
        } else {
          player.runCommand(
            `replaceitem entity @s slot.inventory ${i - 9} air`
          );
        }
        ctx.GiveAction();
        page.slots[slot] = {
          item: null,
          action: (ctx) => {
            inventory.addItem(ctx.getItemAdded());
          },
        };
      },
    };
  }
}

/**
 * Fills the chest Screen with the desired kit
 */
export function ViewPlayerEnderChestFill(
  entity: Entity,
  page: Page,
  extras: any
) {
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  const player = [...world.getPlayers()].find((p) => p.name == extras?.name);
  if (!player) return;
  /**
   * the value of how many slots have been taken
   */
  let used_slots = 0;
  for (const item of Object.values(MinecraftItemTypes)) {
    try {
      player.runCommand(
        `testfor @s[hasitem={item=${item.id},location=slot.enderchest}]`
      );
      const ChestGuiItem = new Item(item.id, 1, 0, {
        nameTag: "Note: §l§cThis is not the exzact item",
      });
      const slot = FILLABLE_SLOTS_ENDERCHEST[used_slots];
      container.setItem(slot, ChestGuiItem.setComponents());
      page.slots[slot] = {
        item: ChestGuiItem,
        action: (ctx) => {
          ctx.GiveAction();
          page.slots[slot] = null;
        },
      };
      used_slots++;
    } catch (error) {}
  }
}

new Page("moderation:see", 54, ViewPlayersFill)
  .setSlots(
    [45, 46, 47, 49, 51, 52, 53],
    new Item("minecraft:stained_glass_pane", 1, 15, {
      nameTag: "§r",
    }),
    (ctx) => {
      ctx.SetAction();
    }
  )
  .setSlots(
    [50],
    new Item("minecraft:arrow", 1, 0, {
      nameTag: "§fBack",
    }),
    (ctx) => {
      ctx.PageAction("home");
    }
  )
  .setButtonAtSlot(48, CloseGuiButton);

new Page("moderation:see_inventory", 54, ViewPlayerInventoryFill)
  .setSlots(
    [45, 46, 47, 49, 51, 52, 53],
    new Item("minecraft:stained_glass_pane", 1, 15, {
      nameTag: "§r",
    }),
    (ctx) => {
      ctx.SetAction();
    }
  )
  .setSlots(
    [50],
    new Item("minecraft:arrow", 1, 0, {
      nameTag: "§fBack",
    }),
    (ctx) => {
      ctx.PageAction("moderation:see");
    }
  )
  .setButtonAtSlot(48, CloseGuiButton);

new Page("moderation:see_ender_chest", 54, ViewPlayerEnderChestFill)
  .setSlots(
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 18, 26, 27, 35, 36, 44, 45, 46, 47, 49,
      51, 52, 53,
    ],
    new Item("minecraft:stained_glass_pane", 1, 15, {
      nameTag: "§r",
    }),
    (ctx) => {
      ctx.SetAction();
    }
  )
  .setSlots(
    [50],
    new Item("minecraft:arrow", 1, 0, {
      nameTag: "§fBack",
    }),
    (ctx) => {
      ctx.PageAction("moderation:see");
    }
  )
  .setButtonAtSlot(48, CloseGuiButton);
