import { DynamicPropertiesDefinition, EntityTypes, ItemStack, MinecraftEntityTypes, MinecraftItemTypes, Player, system, world, } from "mojang-minecraft";
import { getId, runCommand } from "./utils";
import { ENTITY_IDENTIFER } from "./config/database";
import { TABLES } from "./lib/Database/tables";
import "./lib/Command/index";
import "./lib/Chest GUI/index";
import "./modules/commands/import";
import "./modules/managers/import";
import "./modules/pages/import";
import "./modules/protections/import";
export let NPC_LOCATIONS = [];
export function clearNpcLocations() {
    NPC_LOCATIONS = [];
}
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);
world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
    runCommand(`tickingarea add 0 0 0 0 0 0 db true`);
    let def = new DynamicPropertiesDefinition();
    def.defineString("name", 30);
    def.defineNumber("index");
    propertyRegistry.registerEntityTypeDynamicProperties(def, EntityTypes.get(ENTITY_IDENTIFER));
    let def2 = new DynamicPropertiesDefinition();
    def2.defineString("role", 30);
    propertyRegistry.registerEntityTypeDynamicProperties(def2, MinecraftEntityTypes.player);
    let def3 = new DynamicPropertiesDefinition();
    def3.defineBoolean("roleHasBeenSet");
    def3.defineString("worldsOwner", 100);
    propertyRegistry.registerWorldDynamicProperties(def3);
});
system.events.beforeWatchdogTerminate.subscribe((data) => {
    data.cancel = true;
    console.warn(`WATCHDOG TRIED TO CRASH = ${data.terminateReason}`);
});
let e = world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
    if (world.getDynamicProperty("roleHasBeenSet"))
        return world.events.beforeDataDrivenEntityTriggerEvent.unsubscribe(e);
    if (!(data.entity instanceof Player))
        return;
    if (data.id != "rubedo:becomeAdmin")
        return;
    data.entity.setDynamicProperty("role", "admin");
    TABLES.roles.set(data.entity.name, "admin");
    world.setDynamicProperty("roleHasBeenSet", true);
    world.setDynamicProperty("worldsOwner", getId(data.entity));
    data.entity.tell(`§l§cYou have been given admin, the function start will not work anymore!!!!`);
});
