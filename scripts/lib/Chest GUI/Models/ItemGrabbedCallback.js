import {
  ActionFormData,
  MessageFormData,
  ModalFormData,
  ActionFormResponse,
  ModalFormResponse,
  MessageFormResponse,
} from "mojang-minecraft-ui";
import { ChestGUI } from "./ChestGUI";
import { InventoryComponentContainer, ItemStack } from "mojang-minecraft";
import { sleep } from "../../Scheduling/utils";
import { ItemDatabase } from "../database/Item";

export class ItemGrabbedCallback {
  /**
   *
   * @param {ChestGUI} gui the chest gui
   * @param {import("./Page").Slot} slot the slot informtaion
   * @param {import("./ChestGUI").SlotChangeReturn} change change that occured
   */
  constructor(gui, slot, change) {
    this.gui = gui;
    this.slot = slot;
    this.change = change;
  }

  /**
   * Messages to the owner of this gui
   * @param {string} text Message or a lang code
   * @example ctx.reply('Hello World!');
   */
  message(text) {
    this.gui.player.tell(text);
  }

  /**
   * Gets the item added
   * @returns {ItemStack | null}
   */
  getItemAdded() {
    if (this.slot.item) return null;
    return this.gui.entity
      .getComponent("minecraft:inventory")
      .container.getItem(this.change.slot);
  }

  /**
   * Gives the player the item the grabbed
   * @param {ItemStack} item item to give
   */
  GiveAction(item = this.slot.item.itemStack) {
    this.gui.player.getComponent("minecraft:inventory").container.addItem(item);
  }

  /**
   * Gives the player the item that was grabbed also removes this item from the gui + db
   * @param {ItemDatabase} db the item database to remove this item from
   */
  TakeAction(db = null) {
    this.gui.player
      .getComponent("minecraft:inventory")
      .container.addItem(this.slot.item.itemStack);
    this.gui.page.slots[this.change.slot] = null;
    if (!db) return;
    db.delete(this.slot.item.components.dbKey);
  }

  /**
   * Changes the page of the chestGui when this item is grabbed
   * @param {String} page page to send to
   * @param {any} extras stuff to be passed onto the page
   */
  PageAction(page, extras) {
    this.gui.setPage(page, extras);
  }

  /**
   * Sends the GUI back to the x previous page
   * @param {Number} amount amount of pages to go back
   */
  BackAction(amount = 1) {
    if (this.gui.pageHistory.length < amount)
      return new Error(`Tried to Go back to a page number that doesnt exist`);
    const pageID = this.gui.pageHistory.slice(-1 - amount)[0];
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
    /**
     * @type {InventoryComponentContainer}
     */
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
  async FormAction(form) {
    this.CloseAction();
    await sleep(5);
    return await form.show(this.gui.player);
  }
}
