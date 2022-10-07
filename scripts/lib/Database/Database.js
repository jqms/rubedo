import { ENTITY_DIMENSION, ENTITY_IDENTIFER, ENTITY_LOCATION, MAX_DATABASE_STRING_SIZE, } from "../../config/database";
import { ItemStack, MinecraftItemTypes, } from "mojang-minecraft";
import { chunkString } from "./utils";
export class Database {
    constructor(name) {
        this.name = name;
        this.savedEntitys = undefined;
        this.MEMORY = undefined;
    }
    static compress(string) {
        return string;
    }
    static decompress(string) {
        return string;
    }
    static createEntity(name, index) {
        let entity = ENTITY_DIMENSION.spawnEntity(ENTITY_IDENTIFER, ENTITY_LOCATION);
        entity.setDynamicProperty("name", name);
        entity.setDynamicProperty("index", index);
        const inv = entity.getComponent("inventory").container;
        const defaultItem = new ItemStack(MinecraftItemTypes.acaciaBoat, 1);
        if (index == 0)
            defaultItem.nameTag = "{}";
        inv.setItem(0, defaultItem);
        return entity;
    }
    static getInventorySlotName(entity, slot) {
        const inv = entity.getComponent("inventory").container;
        return inv.getItem(slot)?.nameTag;
    }
    static setInventorySlotName(entity, slot, value) {
        const inv = entity.getComponent("inventory").container;
        let item = inv.getItem(slot);
        item.nameTag = value;
        return inv.setItem(slot, item);
    }
    get entitys() {
        if (this.savedEntitys)
            return this.savedEntitys;
        const ens = ENTITY_DIMENSION.getEntitiesAtBlockLocation(ENTITY_LOCATION).filter((e) => e.id == ENTITY_IDENTIFER && e.getDynamicProperty("name") == this.name);
        this.savedEntitys = ens;
        return ens;
    }
    data() {
        if (this.MEMORY)
            return this.MEMORY;
        if (this.entitys.length == 0)
            Database.createEntity(this.name, 0);
        if (this.entitys.length == 1) {
            let data = JSON.parse(Database.decompress(Database.getInventorySlotName(this.entitys[0], 0)));
            this.MEMORY = data;
            return data;
        }
        let data = new Array(this.entitys.length);
        for (const entity of this.entitys) {
            let index = entity.getDynamicProperty("index");
            data[index] = Database.getInventorySlotName(entity, 0);
        }
        try {
            data = JSON.parse(data.join(""));
        }
        catch (error) {
            data = {};
        }
        this.MEMORY = data;
        return data;
    }
    save(data) {
        this.MEMORY = data;
        const dataSplit = chunkString(Database.compress(JSON.stringify(data)), MAX_DATABASE_STRING_SIZE);
        if (this.entitys && dataSplit.length == this.entitys.length) {
            for (let i = 0; i < dataSplit.length; i++) {
                Database.setInventorySlotName(this.entitys[i], 0, dataSplit[i]);
            }
        }
        else {
            this.entitys?.forEach((e) => e?.triggerEvent("despawn"));
            this.savedEntitys = undefined;
            for (let i = 0; i < dataSplit.length; i++) {
                const entity = Database.createEntity(this.name, i);
                Database.setInventorySlotName(entity, 0, dataSplit[i]);
            }
        }
    }
    set(key, value) {
        const data = this.data();
        data[key] = value;
        this.save(data);
    }
    get(key) {
        return this.data()[key];
    }
    has(key) {
        return this.keys().includes(key);
    }
    delete(key) {
        let data = this.data();
        const status = delete data[key];
        this.save(data);
        return status;
    }
    size() {
        return this.keys().length;
    }
    clear() {
        this.save({});
    }
    keys() {
        return Object.keys(this.data());
    }
    values() {
        return Object.values(this.data());
    }
    getCollection() {
        return this.data();
    }
}
