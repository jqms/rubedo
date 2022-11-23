import { MinecraftBlockTypes, MinecraftItemTypes } from "@minecraft/server";

/**
 * List of items that are considered banned and will not let any "member" hold
 */
export const BANNED_ITEMS = [
  // Common CBE Items
  MinecraftItemTypes.beehive.id,
  MinecraftItemTypes.beeNest.id,
  MinecraftItemTypes.axolotlBucket.id,
  MinecraftItemTypes.codBucket.id,
  MinecraftItemTypes.tadpoleBucket.id,
  MinecraftItemTypes.tropicalFishBucket.id,
  MinecraftItemTypes.salmonBucket.id,
  MinecraftItemTypes.pufferfishBucket.id,

  // Op Only Items
  MinecraftItemTypes.allow.id,
  MinecraftItemTypes.barrier.id,
  MinecraftItemTypes.borderBlock.id,
  MinecraftItemTypes.debugStick?.id ?? "minecraft:debug_stick",
  MinecraftItemTypes.deny.id,
  MinecraftItemTypes.jigsaw.id,
  MinecraftItemTypes.lightBlock.id,
  MinecraftItemTypes.commandBlock.id,
  MinecraftItemTypes.repeatingCommandBlock.id,
  MinecraftItemTypes.chainCommandBlock.id,
  MinecraftItemTypes.structureBlock.id,
  MinecraftItemTypes.structureVoid.id,

  // Not Normal Items
  MinecraftItemTypes.bedrock.id,
  MinecraftItemTypes.commandBlockMinecart.id,
  MinecraftItemTypes.endPortalFrame.id,

  // Server Movment Blocks
  "minecraft:info_update",
  "minecraft:info_update2",
  "minecraft:reserved3",
  "minecraft:reserved4",
  "minecraft:reserved6",
  "minecraft:movingBlock",
  "minecraft:moving_block",
  "minecraft:movingblock",
  "minecraft:piston_arm_collision",
  "minecraft:piston_arm_collision",
  "minecraft:pistonarmcollision",
  "minecraft:stickyPistonArmCollision",
  "minecraft:sticky_piston_arm_collision",
  "minecraft:unknown",

  // Common Hacked Items
  "minecraft:glowingobsidian",
  "minecraft:invisible_bedrock",
  "minecraft:invisiblebedrock",
  "minecraft:netherreactor",
  "minecraft:portal",
  "minecraft:fire",
  "minecraft:water",
  "minecraft:lava",
  "minecraft:flowing_lava",
  "minecraft:flowing_water",
  "minecraft:soul_fire",
];

/**
 * List of blocks that cannot be placed down
 */
export const BANNED_BLOCKS = [
  // Common CBE Items
  MinecraftBlockTypes.beehive.id,
  MinecraftBlockTypes.beeNest.id,
  "minecraft:movingBlock",
  "minecraft:movingblock",
  "minecraft:moving_block",

  // Should Not be Placed
  MinecraftBlockTypes.bedrock.id,
  MinecraftBlockTypes.barrier.id,
  "minecraft:invisiblebedrock",
];

/**
 * A List of all containers a item could be in
 * @note only blocks that are supported by script api
 */
export const BLOCK_CONTAINERS = [
  "minecraft:chest",
  "minecraft:trapped_chest",
  //"minecraft:barrel",
  //"minecraft:dispenser",
  //"minecraft:dropper",
  //"minecraft:furnace",
  //"minecraft:blast_furnace",
  //"minecraft:lit_furnace",
  //"minecraft:lit_blast_furnace",
  //"minecraft:hopper",
  //"minecraft:shulker_box",
  //"minecraft:undyed_shulker_box",
];

/**
 * The block size to check for blockContainers
 */
export const CHECK_SIZE = { x: 7, y: 7, z: 7 };
