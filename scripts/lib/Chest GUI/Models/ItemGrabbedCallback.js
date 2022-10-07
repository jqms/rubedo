import { sleep } from "../../Scheduling/utils";
export class ItemGrabbedCallback {
    constructor(gui, slot, change) {
        this.gui = gui;
        this.slot = slot;
        this.change = change;
    }
    message(text) {
        this.gui.player.tell(text);
    }
    getItemAdded() {
        if (this.slot.item)
            return null;
        return this.gui.entity
            .getComponent("minecraft:inventory")
            .container.getItem(this.change.slot);
    }
    GiveAction(item = this.slot.item.itemStack) {
        this.gui.player.getComponent("minecraft:inventory").container.addItem(item);
    }
    TakeAction(db = null) {
        this.gui.player
            .getComponent("minecraft:inventory")
            .container.addItem(this.slot.item.itemStack);
        this.gui.page.slots[this.change.slot] = null;
        if (!db)
            return;
        db.delete(this.slot.item.components.dbKey);
    }
    PageAction(page, extras) {
        this.gui.setPage(page, extras);
    }
    BackAction(amount = 1) {
        if (this.gui.pageHistory.length < amount)
            return new Error(`Tried to Go back to a page number that doesnt exist`);
        console.warn(JSON.stringify(this.gui.pageHistory));
        const pageID = this.gui.pageHistory.splice(-1 - amount)[0];
        console.warn(JSON.stringify(this.gui.page.extras));
        this.PageAction(pageID, this.gui.page.extras);
    }
    CloseAction() {
        this.gui.kill();
    }
    SetAction() {
        const container = this.gui.entity.getComponent("minecraft:inventory").container;
        container.setItem(this.change.slot, this.slot.item.itemStack);
    }
    async FormAction(form) {
        this.CloseAction();
        await sleep(5);
        return await form.show(this.gui.player);
    }
}
