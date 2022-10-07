import { ItemStack } from "mojang-minecraft";
import { PAGES } from "../pages.js";
import { BackButton, CloseGuiButton } from "./Buttons.js";
import { DefaultFill, FillTypeCallback } from "./FillTypes";
import { Item } from "./Item";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback";

export interface ISlot {
  /**
   * the Item in this slot
   */
  item: Item;
  /**
   * the that runs when item is grabbed
   */
  action: (callback: ItemGrabbedCallback) => void;
}

/**
 * Converts a itemStack to a unique id
 */
export function getItemUid(item: ItemStack): string {
  let uid = "";
  if (item) {
    let { id, nameTag, amount, data } = item;
    uid = [id, nameTag, amount, data].join("");
  }
  return uid;
}

export class Page {
  fillType: FillTypeCallback;
  size: number;
  slots: Array<ISlot>;
  id: string;
  extras: any;

  /**
   * Creats a new page
   * @param {string} id the unique id of this page
   * @param {number} size the size of the GUI
   * @param {function(Entity, Page, any)} fillType how this page fills
   */
  constructor(
    id: string,
    size: number,
    fillType: FillTypeCallback = DefaultFill
  ) {
    if (size % 9 != 0) throw new Error("Size needs to be in a increment of 9");
    if (PAGES[id]) throw new Error(`Id of ${id} Already exsists`);
    this.id = id;
    this.size = size;
    this.slots = Array(this.size);
    this.fillType = fillType;
    PAGES[id] = this;
  }
  /**
   * Adds a item to the page
   */
  setSlots(
    slot: Array<number>,
    item: Item,
    action: (ctx: ItemGrabbedCallback) => void
  ): Page {
    const data = item ? { item: item, action: action } : null;
    for (const i of slot) {
      this.slots[i] = data;
    }
    return this;
  }

  /**
   * Adds a Button to this page at a slot
   */
  setButtonAtSlot(slot: number, button: BackButton | CloseGuiButton): Page {
    // @ts-ignore
    this.slots[slot] = { item: button.Item, action: button.Action };
    return this;
  }
}
