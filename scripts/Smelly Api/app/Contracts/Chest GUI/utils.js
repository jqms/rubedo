import {
  EntityQueryOptions,
  Player,
  PlayerInventoryComponentContainer,
} from "mojang-minecraft";
import { Item } from "./Models/Item";

/**
 * Clears the player of a item in there pointer slot
 * @param {Player} player
 * @param {Item} ItemToClear
 */
export function clearPlayersPointer(player, ItemToClear) {
  try {
    /**
     * @type {PlayerInventoryComponentContainer}
     */
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
    // the item couldnt be cleared that means
    // they now have a item witch is really BAD
    const q = new EntityQueryOptions();
    (q.type = "minecraft:item"), (q.location = player.location);
    q.maxDistance = 2;
    q.closest = 1;
    [...player.dimension.getEntities(q)].forEach((e) => e.kill());
  }
}

/**
 * Gets a item at slot
 * @param {Entity} entity entity to grab from
 * @param {number} slot slot number to get
 * @returns {ItemStack | null}
 */
export function getItemAtSlot(entity, slot) {
  /**
   * @type {InventoryComponentContainer}
   */
  const inventory = entity.getComponent("minecraft:inventory").container;
  return inventory.getItem(slot);
}
