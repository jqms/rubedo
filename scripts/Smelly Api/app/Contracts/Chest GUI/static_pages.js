import { CloseGuiButton } from "./Models/Buttons.js";
import { DefaultFill } from "./Models/FillTypes.js";
import { Item } from "./Models/Item.js";
import { Page } from "./Models/Page.js";

/**
 * The Home page of this GUI this is the most important because
 * when the GUI is opned it will open up here, any plugin can
 * change this but this is the default screen
 * @type {Page}
 */
export let HOME_PAGE = new Page("home", 54, DefaultFill)
  .setSlots(
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 18, 26, 27, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44,
    ],
    new Item("minecraft:stained_glass_pane", 1, 15, {
      nameTag: "§r",
    }),
    (ctx) => {
      ctx.SetAction();
    }
  )
  .setSlots(
    [22],
    new Item("minecraft:ender_chest", 1, 0, {
      nameTag: "§l§bCheck Players Inventorys",
    }),
    (ctx) => {
      ctx.PageAction("vault:viewVault", { playerName: ctx.gui.player.name });
    }
  )
  .setButtonAtSlot(49, CloseGuiButton);
