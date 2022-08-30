import { Item } from "./Item";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback";

/**
 * @typedef {Object} Button a default button instance
 * @property {Item} Item The Item that is used as the buttons look
 * @property {(ItemGrabbedCallback) => {}} Action the action this Button Runs
 */

export class BackButton {
  /**
   * The Gui Item Class of this button
   */
  static Item = new Item("minecraft:arrow", 1, 0, {
    nameTag: "§fBack",
  });
  /**
   * The Action that this button is running
   * @param {ItemGrabbedCallback} ctx action to run
   */
  static Action = (ctx) => {
    ctx.BackAction()
  };
}

export class CloseGuiButton {
  /**
   * The Gui Item Class of this button
   */
   static Item = new Item("minecraft:barrier", 1, 0, {
    nameTag: "§cClose GUI",
  });
  /**
   * The Action that this button is running
   * @param {ItemGrabbedCallback} ctx action to run
   */
  static Action = (ctx) => {
    ctx.CloseAction()
  };
}
