import { world } from "mojang-minecraft";
import { GUI_ITEM } from "../../config/chest.js";
import { ChestGUI, CURRENT_GUIS } from "./Models/ChestGUI.js";
import { getHeldItem } from "./utils.js";
import "./static_pages.js";
import { forEachValidPlayer } from "../../utils.js";
forEachValidPlayer((player) => {
    if (getHeldItem(player)?.id != GUI_ITEM)
        return;
    let PLAYERS_GUI = CURRENT_GUIS[player.name];
    if (!PLAYERS_GUI)
        CURRENT_GUIS[player.name] = new ChestGUI(player);
});
world.events.tick.subscribe(() => {
    for (const gui of Object.values(CURRENT_GUIS)) {
        if (!gui.entity?.id)
            continue;
        try {
            const health = gui.entity.getComponent("minecraft:health");
            if (health.current <= 0)
                return gui.kill();
        }
        catch (error) {
            gui.kill();
        }
        if (getHeldItem(gui.player)?.id != GUI_ITEM)
            return gui.kill();
        if (!gui.player)
            return gui.kill();
        gui.entity.teleport(gui.player.location, gui.player.dimension, 0, 0);
    }
});
