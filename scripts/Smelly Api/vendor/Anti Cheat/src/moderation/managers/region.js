import { MinecraftBlockTypes } from "mojang-minecraft";
import { BlockLocation, world } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { Region } from "../../Models/Region.js";
import { forEachValidPlayer, getRole, loadRegionDenys } from "../../utils.js";

/**
 * All doors and switches in minecraft
 */
const DOORS_SWITCHES = [
  "minecraft:acacia_door",
  "minecraft:acacia_trapdoor",
  "minecraft:acacia_button",
  "minecraft:birch_door",
  "minecraft:birch_trapdoor",
  "minecraft:birch_button",
  "minecraft:crimson_door",
  "minecraft:crimson_trapdoor",
  "minecraft:crimson_button",
  "minecraft:dark_oak_door",
  "minecraft:dark_oak_trapdoor",
  "minecraft:dark_oak_button",
  "minecraft:jungle_door",
  "minecraft:jungle_trapdoor",
  "minecraft:jungle_button",
  "minecraft:mangrove_door",
  "minecraft:mangrove_trapdoor",
  "minecraft:mangrove_button",
  "minecraft:spruce_door",
  "minecraft:spruce_trapdoor",
  "minecraft:spruce_button",
  "minecraft:warped_door",
  "minecraft:warped_trapdoor",
  "minecraft:warped_button",
  "minecraft:wooden_door",
  "minecraft:wooden_button",
  "minecraft:trapdoor",
  "minecraft:iron_door",
  "minecraft:iron_trapdoor",
  "minecraft:polished_blackstone_button",
  "minecraft:lever",
];

/**
 * A List of all containers a item could be in
 */
export const BLOCK_CONTAINERS = [
  "minecraft:chest",
  "minecraft:barrel",
  "minecraft:trapped_chest",
  "minecraft:dispenser",
  "minecraft:dropper",
  "minecraft:furnace",
  "minecraft:blast_furnace",
  "minecraft:lit_furnace",
  "minecraft:lit_blast_furnace",
  "minecraft:hopper",
  "minecraft:shulker_box",
  "minecraft:undyed_shulker_box",
];

/**
 * Sets Deny blocks at bottom of region every 5 mins
 */
SA.Utilities.time.setTickInterval(() => {
  loadRegionDenys();
}, 6000);

/**
 * Permissions for region
 */
world.events.beforeItemUseOn.subscribe((data) => {
  if (getRole(data.source.name) == "moderator" || "admin") return;
  const region = Region.blockLocationInRegion(
    data.blockLocation,
    data.source.dimension.id
  );
  const block = data.source.dimension.getBlock(data.blockLocation);
  if (!region) return;
  if (DOORS_SWITCHES.includes(block.id) && region.permissions.doorsAndSwitches)
    return;
  if (BLOCK_CONTAINERS.includes(block.id) && region.permissions.openContainers)
    return;
  data.cancel = true;
});

/**
 * Gives player a tag if they are in a region
 */
world.events.tick.subscribe((data) => {
  const players = world.getPlayers();
  for (const region of Region.getAllRegions()) {
    for (const player of players) {
      if (region.playerInRegion(player)) {
        player.addTag(`inRegion`);
        if (!region.permissions.pvp) player.addTag(`region-protected`);
      } else {
        player.removeTag(`inRegion`);
        player.removeTag(`region-protected`);
      }
    }
  }
});
