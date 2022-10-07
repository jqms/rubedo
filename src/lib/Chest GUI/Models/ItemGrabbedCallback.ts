import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
  ActionFormResponse,
  ModalFormResponse,
  MessageFormResponse,
} from "mojang-minecraft-ui";
import { ChestGUI, ISlotChangeReturn } from "./ChestGUI";
import { InventoryComponentContainer, ItemStack } from "mojang-minecraft";
import { sleep } from "../../Scheduling/utils";
import { ItemDatabase } from "../database/Item";
import { ISlot } from "./Page";

type FormActionReturn<T> = T extends ActionFormData
  ? Promise<ActionFormResponse>
  : T extends ModalFormData
  ? Promise<ModalFormResponse>
  : Promise<MessageFormResponse>;

export class ItemGrabbedCallback {
  gui: ChestGUI;
  slot: ISlot;
  change: ISlotChangeReturn;
  /**
   * New Callback
   */
  constructor(gui: ChestGUI, slot: ISlot, change: ISlotChangeReturn) {
    this.gui = gui;
    this.slot = slot;
    this.change = change;
  }

  /**
   * Messages to the owner of this gui
   * @example ctx.reply('Hello World!');
   */
  message(text: string) {
    this.gui.player.tell(text);
  }

  /**
   * Gets the item added
   */
  getItemAdded(): ItemStack | null {
    if (this.slot.item) return null;
    return this.gui.entity
      .getComponent("minecraft:inventory")
      .container.getItem(this.change.slot);
  }

  /**
   * Gives the player the item the grabbed
   */
  GiveAction(item: ItemStack = this.slot.item.itemStack) {
    this.gui.player.getComponent("minecraft:inventory").container.addItem(item);
  }

  /**
   * Gives the player the item that was grabbed also removes this item from the gui + db
   * @param db the item database to remove this item from
   */
  TakeAction(db: ItemDatabase = null) {
    this.gui.player
      .getComponent("minecraft:inventory")
      .container.addItem(this.slot.item.itemStack);
    this.gui.page.slots[this.change.slot] = null;
    if (!db) return;
    db.delete(this.slot.item.components.dbKey);
  }

  /**
   * Changes the page of the chestGui when this item is grabbed
   * @param page page to send to
   * @param extras stuff to be passed onto the page
   */
  PageAction(page: string, extras?: any) {
    this.gui.setPage(page, extras);
  }

  /**
   * Sends the GUI back to the x previous page
   * @param amount amount of pages to go back
   */
  BackAction(amount: number = 1) {
    if (this.gui.pageHistory.length < amount)
      return new Error(`Tried to Go back to a page number that doesnt exist`);
    console.warn(JSON.stringify(this.gui.pageHistory));
    const pageID = this.gui.pageHistory.splice(-1 - amount)[0];
    console.warn(JSON.stringify(this.gui.page.extras));
    this.PageAction(pageID, this.gui.page.extras);
  }

  /**
   * Closes the chect GUI when this item is grabbed
   */
  CloseAction() {
    this.gui.kill();
  }

  /**
   * Sets the item back
   */
  SetAction() {
    const container = this.gui.entity.getComponent(
      "minecraft:inventory"
    ).container;
    container.setItem(this.change.slot, this.slot.item.itemStack);
  }

  /**
   * Opens a form to the player
   * @param {ActionFormData | ModalFormData | MessageFormData} form form to load
   * @returns {Promise<ActionFormResponse | ModalFormResponse | MessageFormResponse>}
   */
  async FormAction<T extends ActionFormData | ModalFormData | MessageFormData>(
    form: T
  ): Promise<FormActionReturn<T>> {
    this.CloseAction();
    await sleep(5);
    // @ts-ignore
    return await form.show(this.gui.player);
  }
}
