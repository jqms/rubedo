import { AIR } from "../../../index.js";
/**
 * Fills a entity with desired itmes
 */
export function DefaultFill(entity, page, extras) {
    const container = entity.getComponent("minecraft:inventory").container;
    for (let i = 0; i < container.size; i++) {
        const slot = page.slots[i];
        if (!slot || !slot.item) {
            container.setItem(i, AIR);
            continue;
        }
        container.setItem(i, slot.item.setComponents());
    }
}
