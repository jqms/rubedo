import { world } from "mojang-minecraft";
import { GUI_ITEM } from "../../config/chest.js";
import { ChestGUI, CURRENT_GUIS } from "./Models/ChestGUI.js";
import { getHeldItem } from "./utils.js";
import "./static_pages.js";
import { forEachValidPlayer } from "../../utils.js";

/*
|--------------------------------------------------------------------------
| Player to Chest GUI Manager
|--------------------------------------------------------------------------
|
| This system makes sure a player always has a chest GUI when they have the
| GUI_ITEM out this is a very important script because without this
| the chest GUI would not spawn or despawn when moved
|
*/
forEachValidPlayer((player) => {
  if (getHeldItem(player)?.id != GUI_ITEM) return;
  let PLAYERS_GUI = CURRENT_GUIS[player.name];
  if (!PLAYERS_GUI) CURRENT_GUIS[player.name] = new ChestGUI(player);
});

/*
|--------------------------------------------------------------------------
| Chest GUI Page Manager
|--------------------------------------------------------------------------
|
| This system checks all GUIS in the world, it checks for changes
| in the inventory and if it finds one it will run the onSlotChange function
| also this helps with moving the entitys and killing the inactive ones
|
*/
world.events.tick.subscribe(() => {
  for (const gui of Object.values(CURRENT_GUIS)) {
    if (!gui.entity?.id) continue;
    try {
      const health = gui.entity.getComponent("minecraft:health");
      if (health.current <= 0) return gui.kill();
    } catch (error) {
      gui.kill();
    }
    if (getHeldItem(gui.player)?.id != GUI_ITEM) return gui.kill();
    if (!gui.player) return gui.kill();

    gui.entity.teleport(gui.player.location, gui.player.dimension, 0, 0);
  }
});
