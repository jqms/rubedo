import { forEachValidPlayer } from "../../utils";
import { PlayerLog } from "../models/PlayerLog";
/**
 * Stores all players mapped inventorys
 */
const mappedInventorys = new PlayerLog();
/**
 * Stores the most previous change for a player
 */
const previousChanges = new PlayerLog();
/**
 * Player names that have been mapped
 */
const haveBeenMapped = [];
/**
 * Finds and returns a slot change in a inventory
 */
function getSlotChanges(oldInv, newInv) {
    if (oldInv.length != newInv.length)
        return [];
    const changes = [];
    for (let i = 0; i < newInv.length; i++) {
        if (oldInv[i]?.item?.amount < newInv[i]?.item?.amount ||
            (oldInv[i]?.item?.amount > newInv[i]?.item?.amount &&
                oldInv[i]?.item?.amount != 0)) {
            changes.push({
                slot: i,
                uid: newInv[i].uid,
                oldUid: oldInv[i].uid,
                item: newInv[i].item,
                oldItem: oldInv[i].item,
                moveType: "fluctuation",
            });
            continue;
        }
        if (newInv[i].uid == oldInv[i].uid)
            continue;
        if (oldInv[i]?.item && newInv[i]?.item) {
            changes.push({
                slot: i,
                uid: newInv[i].uid,
                oldUid: oldInv[i].uid,
                item: newInv[i].item,
                oldItem: oldInv[i].item,
                moveType: "swap",
            });
        }
        else if (!newInv[i]?.item) {
            changes.push({
                slot: i,
                uid: oldInv[i].uid,
                item: oldInv[i].item,
                moveType: "delete",
            });
        }
        else if (newInv[i]?.item) {
            changes.push({
                slot: i,
                uid: newInv[i].uid,
                item: newInv[i].item,
                moveType: "put",
            });
        }
    }
    return changes;
}
/**
 * Converts a itemStack to a unique id
 * @param {ItemStack} item
 * @returns {string}
 */
function getItemUid(item) {
    if (!item)
        return "";
    const data = [];
    data.push(item.id);
    data.push(item.nameTag);
    data.push(item.data);
    data.push(item.getLore());
    return data.join("");
}
/**
 * Gets a entitys inventory but with mapped data
 */
function mapInventory(player) {
    /**
     * @type {PlayerInventoryComponentContainer}
     */
    const container = player.getComponent("inventory").container;
    const inventory = [];
    for (let i = 0; i < container.size; i++) {
        let item = container.getItem(i);
        inventory[i] = {
            uid: getItemUid(item),
            item: item,
        };
    }
    return inventory;
}
/**
 * gets all the possible items this player can get
 */
function getPossibleItems(player) {
    let possibleItems = [];
    for (const entity of player.dimension.getEntities({
        maxDistance: 5,
        location: player.location,
    })) {
        if (entity.id == "minecraft:item") {
            let uid = getItemUid(entity.getComponent("item")?.itemStack);
            if (!possibleItems.includes(uid))
                possibleItems.push(uid);
            continue;
        }
        if (entity.getComponent("inventory")?.containerType != "horse")
            continue;
        /**
         * @type {InventoryComponentContainer}
         */
        const inventory = entity.getComponent("inventory").container;
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (!item)
                continue;
            let uid = getItemUid(item);
            if (!possibleItems.includes(uid))
                possibleItems.push(uid);
        }
    }
    return possibleItems;
}
const oldPossibleItems = new PlayerLog();
/**
 * This system verifys changes in a players inventory
 */
forEachValidPlayer((player) => {
    const newInv = mapInventory(player);
    const oldInv = mappedInventorys.get(player) ?? newInv;
    mappedInventorys.set(player, newInv);
    const possibleItems = oldPossibleItems.get(player);
    oldPossibleItems.set(player, getPossibleItems(player));
    /**
     * Trys to find a change in the page
     */
    const changes = getSlotChanges(oldInv, newInv);
    /**
     * @type {Array<Array<SlotChangeReturn>>}
     */
    const prevChanges = previousChanges.get(player);
    if (changes.length == 0)
        return;
    console.warn(`------------ CHANGE IN THE INVENTORY HAS OCCURED ------------`);
    if (player.hasTag("skipCheck")) {
        player.removeTag("skipCheck");
        return;
    }
    console.warn(`changes ${JSON.stringify(changes)}`);
    // There has been s change in the players inventoy lets verify it
    let skipCheck = false;
    for (const change of changes) {
        // @ts-ignore
        if (change?.moveType == "delete") {
            // item has been dropped
            // @ts-ignore
        }
        else if (change?.moveType == "put") {
            // item has been added
            // checks to see if this item was vailiadted before
            console.warn(`possible items: ${JSON.stringify(possibleItems)}`);
            // @ts-ignore
            if (possibleItems.includes(change.uid))
                continue;
            if (player.hasTag("has_container_open"))
                continue;
            console.warn(`previous changes: ${JSON.stringify(prevChanges)}`);
            const prevChange = prevChanges?.[prevChanges?.length - 1];
            if (prevChange &&
                // @ts-ignore
                prevChange.find((v) => v.moveType == "delete") &&
                !player.hasTag("moving"))
                continue;
            // this will return because there is a move of one item across slots in 5 ticks
            // @ts-ignore
            if (changes.find((c) => c.moveType == "delete" && c.uid == change.uid))
                continue;
            // this will continue because it means a player has just seperated a item that had across
            // multiple slots in 5 ticks
            // @ts-ignore
            if (changes.filter((c) => c.uid == change.uid).length > 1)
                continue;
            console.warn(`give detect`);
            player.tell("give detected");
            // @ts-ignore
            if (change.slot < 9) {
                player.runCommand(
                // @ts-ignore
                `replaceitem entity @s slot.hotbar ${change.slot} air`);
            }
            else {
                player.runCommand(
                // @ts-ignore
                `replaceitem entity @s slot.inventory ${change.slot - 9} air`);
            }
            skipCheck = true;
        }
        else {
            // change was a swap
        }
    }
    if (skipCheck)
        return player.addTag("skipCheck");
    prevChanges?.push(changes);
    previousChanges.set(player, prevChanges ?? [changes]);
}, 5);
