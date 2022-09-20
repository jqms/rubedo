import { Entity, InventoryComponentContainer } from "mojang-minecraft";
import { AIR } from "../../../index.js";

/**
 * Fills a entity with desired itmes
 * @param {Entity} entity
 * @param {Object} page page type to fill
 * @param {any} extras stuff to pass to this page
 */
export function DefaultFill(entity, page, extras) {
  /**
   * @type {InventoryComponentContainer}
   */
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    /**
     * @type {import("./Page").Slot}
     */
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
}
