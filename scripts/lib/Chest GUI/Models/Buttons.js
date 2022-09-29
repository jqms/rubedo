import { Item } from "./Item";
/**
 * @typedef {Object} Button a default button instance
 * @property {Item} Item The Item that is used as the buttons look
 * @property {(ItemGrabbedCallback) => {}} Action the action this Button Runs
 */
export class BackButton {
}
/**
 * The Gui Item Class of this button
 */
BackButton.Item = new Item("minecraft:arrow", 1, 0, {
    nameTag: "§fBack",
});
/**
 * The Action that this button is running
 */
BackButton.Action = (ctx) => {
    ctx.BackAction();
};
export class CloseGuiButton {
}
/**
 * The Gui Item Class of this button
 */
CloseGuiButton.Item = new Item("minecraft:barrier", 1, 0, {
    nameTag: "§cClose GUI",
});
/**
 * The Action that this button is running
 */
CloseGuiButton.Action = (ctx) => {
    ctx.CloseAction();
};
