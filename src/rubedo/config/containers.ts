import { MinecraftBlockTypes } from "@minecraft/server";

/**
 * The currently supported block containers by script api
 */
export const API_CONTAINERS = [
  MinecraftBlockTypes.chest.id,
  MinecraftBlockTypes.trappedChest.id,
];

/**
 * The block size to check for blockContainers
 */
export const CHECK_SIZE = { x: 7, y: 7, z: 7 };
