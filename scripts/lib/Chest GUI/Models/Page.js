import { Entity, ItemStack } from "mojang-minecraft";
import { PAGES } from "../pages.js";
import { DefaultFill } from "./FillTypes";
import { Item } from "./Item";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback";

/**
 * @typedef {Object} Slot a gui slot
 * @property {Item} item the Item in this slot
 * @property {function(ItemGrabbedCallback)} action the that runs when item is grabbed
 */

/**
 * Converts a itemStack to a unique id
 * @param {ItemStack} item
 * @returns {string}
 */
export function getItemUid(item) {
  let uid = "";
  if (item) {
    let { id, name, amount, data } = item;
    uid = [id, name, amount, data].join("");
  }
  return uid;
}

export class Page {
  /**
   * Items that are in this page
   * @type {Array<Slot>}
   */
  static slots = [];

  /**
   * Creats a new page
   * @param {string} id the unique id of this page
   * @param {number} size the size of the GUI
   * @param {Array<Item>} items items in the page
   * @param {function(Entity, Page, any)} fillType how this page fills
   */
  constructor(id, size, fillType = DefaultFill) {
    if (size % 9 != 0) return new Error("Size needs to be in a increment of 9");
    if (PAGES[id]) return new Error(`Id of ${id} Already exsists`);
    this.id = id;
    this.size = size;
    this.slots = Array(this.size);
    this.fillType = fillType;
    PAGES[id] = this;
  }
  /**
   * Adds a item to the page
   * @param {Array<Number>} slot where to position the item
   * @param {Item} item a new item
   * @param {function(ItemGrabbedCallback)} action action to preform when this item is grabbed
   * @returns {Page} if it faild or not
   */
  setSlots(slot, item, action) {
    const data = item ? { item: item, action: action } : null;
    for (const i of slot) {
      this.slots[i] = data;
    }
    return this;
  }

  /**
   * Adds a Button to this page at a slot
   * @param {Number} slot where to position the item
   * @param {import("./Buttons").Button} button button to use
   * @returns {Page} if it faild or not
   */
  setButtonAtSlot(slot, button) {
    this.slots[slot] = { item: button.Item, action: button.Action };
    return this;
  }
}
