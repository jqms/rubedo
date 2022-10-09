import { PAGES } from "../pages.js";
import { DefaultFill } from "./FillTypes";
export function getItemUid(item) {
    let uid = "";
    if (item) {
        let { id, nameTag, amount, data } = item;
        uid = [id, nameTag, amount, data].join("");
    }
    return uid;
}
export class Page {
    constructor(id, size, fillType = DefaultFill) {
        if (size % 9 != 0)
            throw new Error("Size needs to be in a increment of 9");
        if (PAGES[id])
            throw new Error(`Id of ${id} Already exsists`);
        this.id = id;
        this.size = size;
        this.slots = Array(this.size);
        this.fillType = fillType;
        PAGES[id] = this;
    }
    setSlots(slot, item, action) {
        const data = item ? { item: item, action: action } : null;
        for (const i of slot) {
            this.slots[i] = data;
        }
        return this;
    }
    setButtonAtSlot(slot, button) {
        this.slots[slot] = { item: button.Item, action: button.Action };
        return this;
    }
}
