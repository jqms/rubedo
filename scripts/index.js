console.warn(`---- STARTING RUBEDO ----`);
import { ItemStack, MinecraftItemTypes, world, } from "@minecraft/server";
import "./lib/Command/index";
import "./lib/Chest GUI/index";
import "./modules/commands/import";
import "./modules/managers/import";
import "./modules/pages/import";
import "./modules/protections/import";
import "./modules/events/import";
import "./plugins/import";
export let NPC_LOCATIONS = [];
export function clearNpcLocations() {
    NPC_LOCATIONS = [];
}
export let CURRENT_TICK = null;
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);
world.events.tick.subscribe((data) => {
    if (!CURRENT_TICK) {
        CURRENT_TICK = data.currentTick;
    }
    else {
        CURRENT_TICK = CURRENT_TICK + 1;
    }
});
