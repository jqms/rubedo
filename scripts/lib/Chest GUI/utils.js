import { DIMENSIONS } from "../../utils";
export async function clearPlayersPointer(player, ItemToClear) {
    try {
        const inventory = player.getComponent("minecraft:inventory").container;
        let itemsToLoad = [];
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item)
                continue;
            if (item?.id == ItemToClear?.id) {
                itemsToLoad.push({ slot: i, item: item });
                inventory.setItem;
                if (i < 9) {
                    player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`);
                }
                else {
                    player.runCommand(`replaceitem entity @s slot.inventory ${i - 9} air`);
                }
            }
        }
        player.runCommand(`clear @s ${ItemToClear?.id} ${ItemToClear.data} ${ItemToClear.amount}`);
        for (const item of itemsToLoad) {
            inventory.setItem(item.slot, item.item);
        }
    }
    catch (error) {
        console.warn(error + error.stack);
    }
}
export function getItemAtSlot(entity, slot) {
    const inventory = entity.getComponent("minecraft:inventory").container;
    return inventory.getItem(slot);
}
export function getEntitys(type) {
    let entitys = [];
    for (const dimension of ["overworld", "nether", "the end"]) {
        [...DIMENSIONS[dimension].getEntities()].forEach((e) => entitys.push(e));
    }
    if (type)
        return entitys.filter((e) => e?.id == type);
    return entitys;
}
export function getHeldItem(player) {
    const inventory = player.getComponent("minecraft:inventory").container;
    return inventory.getItem(player.selectedSlot);
}
