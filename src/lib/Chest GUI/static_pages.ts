import { CloseGuiButton } from "./Models/Buttons.js";
import { DefaultFill } from "./Models/FillTypes.js";
import { Item } from "./Models/Item.js";
import { Page } from "./Models/Page.js";

/**
 * The Home page of this GUI this is the most important because
 * when the GUI is opned it will open up here, any plugin can
 * change this but this is the default screen
 */
export let HOME_PAGE = new Page("home", 54, DefaultFill)
  .setSlots(
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 17, 18, 26, 27, 35, 36, 44, 45, 46, 47, 48,
      50, 51, 52, 53,
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
      nameTag: "§l§bInventory Viewer",
    }),
    (ctx) => {
      ctx.PageAction("moderation:see");
    }
  )
  .setButtonAtSlot(49, CloseGuiButton);
