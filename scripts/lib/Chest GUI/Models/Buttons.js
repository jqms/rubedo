import { Item } from "./Item";
export class BackButton {
}
BackButton.Item = new Item("minecraft:arrow", 1, 0, {
    nameTag: "§fBack",
});
BackButton.Action = (ctx) => {
    ctx.BackAction();
};
export class CloseGuiButton {
}
CloseGuiButton.Item = new Item("minecraft:barrier", 1, 0, {
    nameTag: "§cClose GUI",
});
CloseGuiButton.Action = (ctx) => {
    ctx.CloseAction();
};
