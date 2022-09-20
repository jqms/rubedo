console.warn(`LOADING RUBEDO, START MS: ${Date.now()}`);

import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config/moderation";
import { OBJECTIVES } from "./config/objectives";
import { BlockInventory } from "./modules/models/BlockInventory";
import {
  BlockLocation,
  ItemStack,
  Location,
  MinecraftItemTypes,
  world,
} from "mojang-minecraft";
import { Database } from "./lib/Database/Database.js";
import { setTickInterval } from "./lib/Scheduling/utils.js";
import { PROTECTIONS } from "./config/protections";
import { MANAGERS } from "./config/managers";
import { COMMANDS } from "./config/commands";
import { PAGES } from "./config/chest";
import "./lib/Commands/index.js";
import "./lib/Chest GUI/index.js";

/**
 * All the Database tables that are created
 */
export const TABLES = {
  config: new Database("config"),
  freezes: new Database("freezes"),
  mutes: new Database("mutes"),
  bans: new Database("bans"),
  regions: new Database("regions"),
  config: new Database("config"),
  permissions: new Database("permissions"),
};

/**
 * storage of all container locations in the world
 * @type {Object<string, BlockInventory>}
 */
export let CONTAINER_LOCATIONS = {};

/**
 * Stores npc locations that are verified to allow npcs to spawn in
 * @type {Array<Location>}
 */
export let NPC_LOCATIONS = [];

/**
 * This is air as a item,
 */
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

/**
 * Converts a location to a block location
 * @param {Location} loc a location to convert
 * @returns {BlockLocation}
 */
function locationToBlockLocation(loc) {
  return new BlockLocation(
    Math.floor(loc.x),
    Math.floor(loc.y),
    Math.floor(loc.z)
  );
}

setTickInterval(() => {
  CONTAINER_LOCATIONS = {};
  for (const player of world.getPlayers()) {
    const blockLoc = locationToBlockLocation(player.location);
    const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
    const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);

    for (const location of pos1.blocksBetween(pos2)) {
      if (location.y < -64) continue;
      const block = player.dimension.getBlock(location);
      if (!BLOCK_CONTAINERS.includes(block.id)) continue;
      CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(
        block.getComponent("inventory").container
      );
    }
  }
}, 100);

for (const objective of OBJECTIVES) {
  try {
    world.scoreboard.addObjective(
      objective.objective,
      objective.displayName ?? objective.objective
    );
  } catch (error) {}
}

for (const protection of TABLES.config.get("protections") ?? PROTECTIONS) {
  import(`./modules/protections/${protection}.js`).catch((error) => {
    console.warn(
      `Error on Loading Protection ${protection}: ` + error + error.stack
    );
  });
}

for (const manager of TABLES.config.get("managers") ?? MANAGERS) {
  import(`./modules/managers/${manager}.js`).catch((error) => {
    console.warn(`Error on Loading Manager ${manager}: ` + error + error.stack);
  });
}

for (const command of TABLES.config.get("commands") ?? COMMANDS) {
  import(`./modules/commands/${command}.js`).catch((error) => {
    console.warn(`Error on Loading Command ${command}: ` + error + error.stack);
  });
}

for (const page of PAGES) {
  import(`./modules/pages/${page}.js`).catch((error) => {
    console.warn(`Error on Loading Page ${page}: ` + error + error.stack);
  });
}
