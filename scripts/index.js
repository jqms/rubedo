import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config/moderation";
import { OBJECTIVES } from "./config/objectives";
import { BlockInventory } from "./modules/models/BlockInventory";
import { BlockLocation, world } from "mojang-minecraft";
import { setRole } from "./utils.js";
import { Database } from "./lib/Database/Database.js";
import { setTickInterval } from "./lib/Scheduling/utils.js";
import { PROTECTIONS } from "./config/protections";
import { MANAGERS } from "./config/managers";
import { COMMANDS } from "./config/commands";

export let db_mutes = new Database("mutes");
export let db_freezes = new Database("freezes");
export let db_bans = new Database("bans");
export let db_regions = new Database("regions");
export let db_permissions = new Database("permissions");

/**
 * storage of all container locations in the world
 * @type {Object<string, BlockInventory>}
 */
export let CONTAINER_LOCATIONS = {};

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

for (const protection of PROTECTIONS) {
  import(`./modules/protections/${protection}.js`).catch((error) => {
    console.warn(
      `Error on Loading Protection ${protection}: ` + error + error.stack
    );
  });
}

for (const manager of MANAGERS) {
  import(`./modules/managers/${manager}.js`).catch((error) => {
    console.warn(`Error on Loading Manager ${manager}: ` + error + error.stack);
  });
}

for (const command of COMMANDS) {
  import(`./modules/commands/${command}.js`).catch((error) => {
    console.warn(`Error on Loading Command ${command}: ` + error + error.stack);
  });
}

import "./lib/Commands/index.js";
