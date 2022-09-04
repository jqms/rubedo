import { PlayerInventoryComponentContainer } from "mojang-minecraft";
import { Item } from "../../../../../app/Contracts/Chest GUI/Models/Item.js";
import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";

new SA.Command({
  name: "inv",
  description: "Views the inventory of a player",
  tags: [STAFF_TAG],
})
  .addOption("player", "player", "Player to view")
  .executes((ctx, { player }) => {
    const InvScreen = new SA.ChestGUI.Page("invViewer", 54);
    /**
     * @type {PlayerInventoryComponentContainer}
     */
    const inv = player.getComponent("inventory").container;
    for (let i = 0; i < inv.size; i++) {
      const item = inv.getItem(i);
      if (!item) continue;
      InvScreen.setSlots(i, Item.itemStackToItem(item));
    }
  });
