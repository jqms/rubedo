import { world } from "mojang-minecraft";
import { getItemUid } from "./Page.js";
import { DEFAULT_STATIC_PAGE_ID, ENTITY_INVENTORY, } from "../../../config/chest.js";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback.js";
import { clearPlayersPointer, getEntitys, getItemAtSlot } from "../utils.js";
import { text } from "../../../lang/text.js";
import { PAGES } from "../pages.js";
export const CURRENT_GUIS = {};
export class ChestGUI {
    constructor(player, entity) {
        this.player = player;
        this.playersName = player.name;
        this.entity = entity;
        this.previousMap = null;
        this.HAS_CONTAINER_OPEN = false;
        this.pageHistory = [];
        this.extras = null;
        this.page = null;
        this.loops = [];
        if (!this.entity)
            this.summon();
        this.events = {
            tick: world.events.tick.subscribe(() => {
                try {
                    if (!this.HAS_CONTAINER_OPEN)
                        return;
                    if (!this.previousMap)
                        return;
                    for (const loop of this.loops) {
                        loop();
                    }
                    const change = ChestGUI.getSlotChange(this.previousMap, this.mapInventory);
                    if (change == null)
                        return;
                    this.onSlotChange(change);
                }
                catch (error) {
                    console.warn(error + error.stack);
                }
            }),
            playerLeave: world.events.playerLeave.subscribe(({ playerName }) => {
                if (playerName != this.playersName)
                    return;
                this.kill();
            }),
            beforeDataDrivenEntityTriggerEvent: world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
                if (![
                    "rubedo:has_container_open",
                    "rubedo:dosent_have_container_open",
                ].includes(data.id))
                    return;
                if (data.entity.nameTag != this.player.nameTag)
                    return;
                if (data.id == "rubedo:has_container_open")
                    return (this.HAS_CONTAINER_OPEN = true);
                this.HAS_CONTAINER_OPEN = false;
            }),
        };
        CURRENT_GUIS[this.playersName] = this;
    }
    static getEntitysGuiInstance(entity) {
        return Object.values(CURRENT_GUIS).find((gui) => gui.entity == entity);
    }
    static getSlotChange(oldInv, newInv) {
        if (oldInv.length != newInv.length)
            return null;
        for (let i = 0; i < oldInv.length; i++) {
            if (oldInv[i].uid != newInv[i].uid)
                return { slot: i, item: oldInv[i].item };
        }
        return null;
    }
    summon() {
        try {
            getEntitys(ENTITY_INVENTORY)
                ?.find((e) => e.getTags().includes(`id:${this.playersName}`))
                ?.triggerEvent("despawn");
            let e = world.events.entityCreate.subscribe((data) => {
                if (data.entity?.id == ENTITY_INVENTORY) {
                    this.entity = data.entity;
                    this.entity.addTag(`id:${this.playersName}`);
                    this.setPage(DEFAULT_STATIC_PAGE_ID);
                }
                world.events.entityCreate.unsubscribe(e);
            });
            this.player.triggerEvent("rubedo:spawn_inventory");
        }
        catch (error) {
            console.warn(error + error.stack);
        }
    }
    reload() {
        this.entity.triggerEvent("despawn");
        this.summon();
    }
    kill() {
        try {
            this.entity?.triggerEvent("despawn");
        }
        catch (error) { }
        for (const key in this.events) {
            world.events[key].unsubscribe(this.events[key]);
        }
        delete CURRENT_GUIS[this.playersName];
    }
    setPage(id, extras) {
        this.extras = extras;
        this.pageHistory.push(id);
        this.loops = [];
        const page = PAGES[id];
        if (!page)
            return new Error(text["api.ChestGUI.error.pagenotfound"](id ?? "Undefined"));
        page.fillType(this.entity, page, extras);
        this.page = page;
        this.previousMap = this.mapInventory;
        this.entity.nameTag = `size:${page.size}` ?? "size:27";
    }
    get mapInventory() {
        let container = this.entity.getComponent("inventory").container;
        let inventory = [];
        for (let i = 0; i < container.size; i++) {
            let currentItem = container.getItem(i);
            inventory.push({
                uid: getItemUid(currentItem),
                item: currentItem,
            });
        }
        this.previousMap = inventory;
        return inventory;
    }
    onSlotChange(change) {
        const slot = this.page.slots[change.slot];
        if (!slot) {
            this.entity.runCommand(`replaceitem entity @s slot.inventory ${change.slot} air`);
        }
        else {
            if (slot.item)
                clearPlayersPointer(this.player, slot.item);
            if (!slot.item && !getItemAtSlot(this.entity, change.slot))
                return;
            this.runItemAction(slot, change);
        }
        this.previousMap = this.mapInventory;
    }
    runItemAction(slot, change) {
        if (!slot.action)
            return;
        slot.action(new ItemGrabbedCallback(this, slot, change));
    }
    registerLoop(callback) {
        this.loops.push(callback);
    }
}
