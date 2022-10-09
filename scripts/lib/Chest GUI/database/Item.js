import { Location, world, } from "mojang-minecraft";
import { AIR } from "../../../index.js";
import { DIMENSIONS } from "../../../utils.js";
const ENTITY_LOCATION = new Location(0, 0, 0);
const ENTITY_DATABSE_ID = "rubedo:inventory";
export class ItemDatabase {
    constructor(TABLE_NAME) {
        this.TABLE_NAME = TABLE_NAME;
    }
    get ENTITIES() {
        return [
            ...DIMENSIONS.overworld.getEntities({
                type: ENTITY_DATABSE_ID,
                location: ENTITY_LOCATION,
                tags: [this.TABLE_NAME],
            }),
        ];
    }
    get ITEMS() {
        let ITEMS = [];
        for (const entity of this.ENTITIES) {
            const inv = entity.getComponent("minecraft:inventory").container;
            for (let i = 0; i < inv.size; i++) {
                const item = inv.getItem(i);
                if (!item)
                    continue;
                ITEMS.push(item);
            }
        }
        return ITEMS;
    }
    get(id) {
        const item = this.ITEMS.find((item) => item.getLore().includes(id));
        if (!item)
            return null;
        const lore = item.getLore();
        lore.pop();
        if (lore.length == 0)
            lore.push("");
        item.setLore(lore);
        return item;
    }
    add(item) {
        let entity = null;
        for (const e of this.ENTITIES) {
            const inv = e.getComponent("minecraft:inventory").container;
            if (inv.emptySlotsCount > 0) {
                entity = e;
                break;
            }
        }
        if (!entity) {
            try {
                entity = world
                    .getDimension("overworld")
                    .spawnEntity(ENTITY_DATABSE_ID, ENTITY_LOCATION);
            }
            catch (error) {
                console.warn(error + error.stack);
            }
        }
        try {
            entity.addTag(this.TABLE_NAME);
        }
        catch (error) { }
        const inv = entity.getComponent("minecraft:inventory").container;
        const ID = Date.now();
        let lore = item.getLore() ?? [];
        lore.push(`${ID}`);
        item.setLore(lore);
        inv.addItem(item);
        return `${ID}`;
    }
    delete(id) {
        for (const entity of this.ENTITIES) {
            const inv = entity.getComponent("minecraft:inventory").container;
            for (let i = 0; i < inv.size; i++) {
                const item = inv.getItem(i);
                if (!item || !item.getLore().includes(id))
                    continue;
                inv.setItem(i, AIR);
                return true;
            }
        }
        return false;
    }
    clear() {
        for (const entity of this.ENTITIES) {
            entity.triggerEvent(`despawn`);
        }
    }
}
