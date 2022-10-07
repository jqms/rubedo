import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config/moderation";
import { OBJECTIVES } from "./config/objectives";
import { BlockInventory } from "./modules/models/BlockInventory";
import { BlockLocation, ItemStack, MinecraftItemTypes, world, } from "mojang-minecraft";
import { Database } from "./lib/Database/Database";
import { setTickInterval } from "./lib/Scheduling/utils";
import "./lib/Commands/index";
import "./lib/Chest GUI/index";
import "./modules/commands/import";
import "./modules/managers/import";
export const TABLES = {
    config: new Database("config"),
    freezes: new Database("freezes"),
    mutes: new Database("mutes"),
    bans: new Database("bans"),
    regions: new Database("regions"),
    permissions: new Database("permissions"),
};
export let CONTAINER_LOCATIONS = {};
export let NPC_LOCATIONS = [];
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);
function locationToBlockLocation(loc) {
    return new BlockLocation(Math.floor(loc.x), Math.floor(loc.y), Math.floor(loc.z));
}
setTickInterval(() => {
    CONTAINER_LOCATIONS = {};
    for (const player of world.getPlayers()) {
        const blockLoc = locationToBlockLocation(player.location);
        const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
        const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);
        for (const location of pos1.blocksBetween(pos2)) {
            if (location.y < -64)
                continue;
            const block = player.dimension.getBlock(location);
            if (!BLOCK_CONTAINERS.includes(block.id))
                continue;
            CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(block.getComponent("inventory").container);
        }
    }
}, 100);
for (const objective of OBJECTIVES) {
    try {
        world.scoreboard.addObjective(objective.objective, objective.displayName ?? objective.objective);
    }
    catch (error) { }
}
