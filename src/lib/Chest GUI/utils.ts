import {
  Entity,
  InventoryComponentContainer,
  ItemStack,
  Player,
  PlayerInventoryComponentContainer,
  world,
} from "mojang-minecraft";
import { DIMENSIONS } from "../../utils";
import { sleep } from "../Scheduling/utils";
import { Item } from "./Models/Item";

/**
 * Clears the player of a item in there pointer slot
 */
export async function clearPlayersPointer(player: Player, ItemToClear: Item) {
  try {
    const inventory = player.getComponent("minecraft:inventory").container;
    let itemsToLoad = [];
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (!item) continue;
      if (item?.id == ItemToClear?.id) {
        itemsToLoad.push({ slot: i, item: item });
        inventory.setItem;
        if (i < 9) {
          player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`);
        } else {
          player.runCommand(
            `replaceitem entity @s slot.inventory ${i - 9} air`
          );
        }
      }
    }
    player.runCommand(
      `clear @s ${ItemToClear?.id} ${ItemToClear.data} ${ItemToClear.amount}`
    );
    for (const item of itemsToLoad) {
      inventory.setItem(item.slot, item.item);
    }
  } catch (error) {
    console.warn(error + error.stack);
    // the item couldnt be cleared that means
    // they now have a item witch is really BAD
    // [
    //   ...player.dimension.getEntities({
    //     type: "minecraft:item",
    //     location: player.location,
    //     maxDistance: 2,
    //     closest: 1,
    //   }),
    // ].forEach((e) => e.kill());
  }
}

/**
 * Gets a item at slot
 */
export function getItemAtSlot(entity: Entity, slot: number): ItemStack | null {
  const inventory = entity.getComponent("minecraft:inventory").container;
  return inventory.getItem(slot);
}

/**
 * Returns all entitys
 */
export function getEntitys(type?: string): Array<Entity> {
  let entitys: Array<Entity> = [];
  for (const dimension of ["overworld", "nether", "the end"]) {
    [...DIMENSIONS[dimension as keyof typeof DIMENSIONS].getEntities()].forEach(
      (e) => entitys.push(e)
    );
  }
  if (type) return entitys.filter((e) => e?.id == type);
  return entitys;
}

/**
 * Gets a players held item
 * @example getHeldItem(Player);
 */
export function getHeldItem(player: Player): ItemStack {
  const inventory: PlayerInventoryComponentContainer = player.getComponent(
    "minecraft:inventory"
  ).container;
  return inventory.getItem(player.selectedSlot);
}
