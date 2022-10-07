import { BLOCK_CONTAINERS, CHECK_SIZE } from "./config/moderation";
import { OBJECTIVES } from "./config/objectives";
import { BlockInventory } from "./modules/models/BlockInventory";
import {
  BlockLocation,
  DynamicPropertiesDefinition,
  EntityTypes,
  ItemStack,
  Location,
  MinecraftDimensionTypes,
  MinecraftEntityTypes,
  MinecraftItemTypes,
  world,
} from "mojang-minecraft";
import { Database } from "./lib/Database/Database";
import { setTickInterval } from "./lib/Scheduling/utils";
import "./lib/Commands/index";
import "./lib/Chest GUI/index";
import "./modules/commands/import";
import "./modules/managers/import";

interface ITables {
  [key: string]: Database;
}

/**
 * All the Database tables that are created
 */
export const TABLES: ITables = {
  config: new Database("config"),
  freezes: new Database("freezes"),
  mutes: new Database("mutes"),
  bans: new Database("bans"),
  regions: new Database("regions"),
  permissions: new Database("permissions"),
};

interface IContainerLocation {
  [key: string]: BlockInventory;
}
/**
 * storage of all container locations in the world
 */
export let CONTAINER_LOCATIONS: IContainerLocation = {};

/**
 * Stores npc locations that are verified to allow npcs to spawn in
 */
export let NPC_LOCATIONS: Array<Location> = [];

/**
 * This is air as a item,
 */
export const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

/**
 * Converts a location to a block location
 */
function locationToBlockLocation(loc: Location): BlockLocation {
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

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  let def = new DynamicPropertiesDefinition();
  def.defineString("role", 30);
  propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    MinecraftEntityTypes.player
  );

  /**
   * Add Objectives
   */
  for (const objective of OBJECTIVES) {
    try {
      world.scoreboard.addObjective(
        objective.objective,
        objective.displayName ?? objective.objective
      );
    } catch (error) {}
  }
});
