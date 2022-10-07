// src/config/moderation.ts
var BANNED_ITEMS = [
  "minecraft:beehive",
  "minecraft:beenest",
  "minecraft:acacia_standing_sign",
  "minecraft:acacia_wall_sign",
  "minecraft:agent_spawn_egg",
  "minecraft:allay_spawn_egg",
  "minecraft:allow",
  "minecraft:axolotl_bucket",
  "minecraft:axolotl_spawn_egg",
  "minecraft:balloon",
  "minecraft:bamboo_sapling",
  "minecraft:barrier",
  "minecraft:barrier",
  "minecraft:bat_spawn_egg",
  "minecraft:bedrock",
  "minecraft:bee_nest",
  "minecraft:bee_spawn_egg",
  "minecraft:beehive",
  "minecraft:birch_standing_sign",
  "minecraft:birch_wall_sign",
  "minecraft:blackstone_double_slab",
  "minecraft:blaze_spawn_egg",
  "minecraft:border_block",
  "minecraft:brewingstandblock",
  "minecraft:bubble_column",
  "minecraft:camera",
  "minecraft:carrots",
  "minecraft:cat_spawn_egg",
  "minecraft:cave_spider_spawn_egg",
  "minecraft:cave_vines",
  "minecraft:cave_vines_body_with_berries",
  "minecraft:chain_command_block",
  "minecraft:chemical_heat",
  "minecraft:chemistry_table",
  "minecraft:chicken_spawn_egg",
  "minecraft:client_request_placeholder_block",
  "minecraft:cobbled_deepslate_double_slab",
  "minecraft:cod_bucket",
  "minecraft:cod_spawn_egg",
  "minecraft:colored_torch",
  "minecraft:colored_torch_bp",
  "minecraft:colored_torch_rg",
  "minecraft:command_block",
  "minecraft:command_block_minecart",
  "minecraft:compound",
  "minecraft:compoundcreator",
  "minecraft:cow_spawn_egg",
  "minecraft:creeper_spawn_egg",
  "minecraft:crimson_double_slab",
  "minecraft:crimson_standing_sign",
  "minecraft:crimson_wall_sign",
  "minecraft:darkoak_standing_sign",
  "minecraft:darkoak_wall_sign",
  "minecraft:daylight_detector_inverted",
  "minecraft:debug_stick",
  "minecraft:deepslate_brick_double_slab",
  "minecraft:deepslate_tile_double_slab",
  "minecraft:deny",
  "minecraft:dolphin_spawn_egg",
  "minecraft:donkey_spawn_egg",
  "minecraft:double_cut_copper_slab",
  "minecraft:double_wooden_slab",
  "minecraft:drowned_spawn_egg",
  "minecraft:elder_guardian_spawn_egg",
  "minecraft:end_gateway",
  "minecraft:end_portal",
  "minecraft:end_portal_frame",
  "minecraft:enderman_spawn_egg",
  "minecraft:endermite_spawn_egg",
  "minecraft:evoker_spawn_egg",
  "minecraft:exposed_double_cut_copper_slab",
  "minecraft:fire",
  "minecraft:flowing_lava",
  "minecraft:flowing_water",
  "minecraft:fox_spawn_egg",
  "minecraft:frog_spawn_egg",
  "minecraft:frosted_ice",
  "minecraft:ghast_spawn_egg",
  "minecraft:glow_squid_spawn_egg",
  "minecraft:glow_stick",
  "minecraft:glowingobsidian",
  "minecraft:goat_spawn_egg",
  "minecraft:guardian_spawn_egg",
  "minecraft:hard_glass",
  "minecraft:hard_glass_pane",
  "minecraft:hard_stained_glass",
  "minecraft:hard_stained_glass_pane",
  "minecraft:hoglin_spawn_egg",
  "minecraft:horse_spawn_egg",
  "minecraft:husk_spawn_egg",
  "minecraft:ice_bomb",
  "minecraft:info_update",
  "minecraft:info_update2",
  "minecraft:invisible_bedrock",
  "minecraft:invisiblebedrock",
  "minecraft:item.acacia_door",
  "minecraft:item.bed",
  "minecraft:item.beetroot",
  "minecraft:item.birch_door",
  "minecraft:item.cake",
  "minecraft:item.campfire",
  "minecraft:item.cauldron",
  "minecraft:item.chain",
  "minecraft:item.crimson_door",
  "minecraft:item.dark_oak_door",
  "minecraft:item.flower_pot",
  "minecraft:item.frame",
  "minecraft:item.glow_frame",
  "minecraft:item.hopper",
  "minecraft:item.iron_door",
  "minecraft:item.jungle_door",
  "minecraft:item.kelp",
  "minecraft:item.nether_sprouts",
  "minecraft:item.nether_wart",
  "minecraft:item.reeds",
  "minecraft:item.skull",
  "minecraft:item.soul_campfire",
  "minecraft:item.spruce_door",
  "minecraft:item.warped_door",
  "minecraft:item.wheat",
  "minecraft:item.wooden_door",
  "minecraft:jigsaw",
  "minecraft:jungle_standing_sign",
  "minecraft:jungle_wall_sign",
  "minecraft:lava",
  "minecraft:lava_cauldron",
  "minecraft:light_block",
  "minecraft:lit_blast_furnace",
  "minecraft:lit_deepslate_redstone_ore",
  "minecraft:lit_furnace",
  "minecraft:lit_redstone_lamp",
  "minecraft:lit_redstone_ore",
  "minecraft:lit_smoker",
  "minecraft:llama_spawn_egg",
  "minecraft:magma_cube_spawn_egg",
  "minecraft:medicine",
  "minecraft:melon_stem",
  "minecraft:mob_spawner",
  "minecraft:mooshroom_spawn_egg",
  "minecraft:movingBlock",
  "minecraft:moving_block",
  "minecraft:movingblock",
  "minecraft:mule_spawn_egg",
  "minecraft:netherreactor",
  "minecraft:npc_spawn",
  "minecraft:npc_spawn_egg",
  "minecraft:ocelot_spawn_egg",
  "minecraft:oxidized_double_cut_copper_slab",
  "minecraft:panda_spawn_egg",
  "minecraft:parrot_spawn_egg",
  "minecraft:phantom_spawn_egg",
  "minecraft:pig_spawn_egg",
  "minecraft:piglin_brute_spawn_egg",
  "minecraft:piglin_spawn_egg",
  "minecraft:pillager_spawn_egg",
  "minecraft:piston_arm_collision",
  "minecraft:piston_arm_collision",
  "minecraft:pistonarmcollision",
  "minecraft:polar_bear_spawn_egg",
  "minecraft:polished_blackstone_brick_double_slab",
  "minecraft:polished_blackstone_double_slab",
  "minecraft:polished_deepslate_double_slab",
  "minecraft:portal",
  "minecraft:potatoes",
  "minecraft:powder_snow",
  "minecraft:powder_snow_bucket",
  "minecraft:powered_comparator",
  "minecraft:powered_repeater",
  "minecraft:pufferfish_bucket",
  "minecraft:pufferfish_spawn_egg",
  "minecraft:pumpkin_stem",
  "minecraft:rabbit_spawn_egg",
  "minecraft:rapid_fertilizer",
  "minecraft:ravager_spawn_egg",
  "minecraft:real_double_stone_slab",
  "minecraft:real_double_stone_slab2",
  "minecraft:real_double_stone_slab3",
  "minecraft:real_double_stone_slab4",
  "minecraft:redstone_wire",
  "minecraft:repeating_command_block",
  "minecraft:reserved3",
  "minecraft:reserved4",
  "minecraft:reserved6",
  "minecraft:salmon_bucket",
  "minecraft:salmon_spawn_egg",
  "minecraft:sea_turtle_spawn_egg",
  "minecraft:sheep_spawn_egg",
  "minecraft:shulker_spawn_egg",
  "minecraft:silverfish_spawn_egg",
  "minecraft:skeleton_horse_spawn_egg",
  "minecraft:skeleton_spawn_egg",
  "minecraft:slime_spawn_egg",
  "minecraft:soul_fire",
  "minecraft:soul_fire",
  "minecraft:sparkler",
  "minecraft:spawn_egg",
  "minecraft:spawn_egg",
  "minecraft:spawner",
  "minecraft:spider_spawn_egg",
  "minecraft:spruce_standing_sign",
  "minecraft:spruce_wall_sign",
  "minecraft:squid_spawn_egg",
  "minecraft:standing_banner",
  "minecraft:standing_sign",
  "minecraft:stickyPistonArmCollision",
  "minecraft:sticky_piston_arm_collision",
  "minecraft:stonecutter",
  "minecraft:stray_spawn_egg",
  "minecraft:strider_spawn_egg",
  "minecraft:structure_block",
  "minecraft:structure_void",
  "minecraft:tadpole_bucket",
  "minecraft:tadpole_spawn_egg",
  "minecraft:tripwire",
  "minecraft:tropical_fish_bucket",
  "minecraft:tropical_fish_spawn_egg",
  "minecraft:underwater_torch",
  "minecraft:unknown",
  "minecraft:unlit_redstone_ore",
  "minecraft:unpowered_comparator",
  "minecraft:unpowered_repeater",
  "minecraft:vex_spawn_egg",
  "minecraft:villager_spawn_egg",
  "minecraft:vindicator_spawn_egg",
  "minecraft:wall_banner",
  "minecraft:wall_sign",
  "minecraft:wandering_trader_spawn_egg",
  "minecraft:warden_spawn_egg",
  "minecraft:warped_double_slab",
  "minecraft:warped_standing_sign",
  "minecraft:warped_wall_sign",
  "minecraft:water",
  "minecraft:waxed_double_cut_copper_slab",
  "minecraft:waxed_exposed_double_cut_copper_slab",
  "minecraft:waxed_oxidized_double_cut_copper_slab",
  "minecraft:waxed_weathered_double_cut_copper_slab",
  "minecraft:weathered_double_cut_copper_slab",
  "minecraft:witch_spawn_egg",
  "minecraft:wither_spawn_egg",
  "minecraft:wolf_spawn_egg",
  "minecraft:zoglin_spawn_egg",
  "minecraft:zombie_horse_spawn_egg",
  "minecraft:zombie_spawn_egg",
  "minecraft:zombie_villager_spawn_egg",
  "minecraft:zombified_piglin_spawn_egg"
];
var BANNED_BLOCKS = [
  "minecraft:moving_block",
  "minecraft:beehive",
  "minecraft:beenest"
];
var BLOCK_CONTAINERS = [
  "minecraft:chest",
  "minecraft:trapped_chest"
];
var CHECK_SIZE = { x: 7, y: 7, z: 7 };

// src/config/objectives.ts
var OBJECTIVES = [
  {
    objective: "STAFF_DB",
    displayName: null
  }
];

// src/modules/models/BlockInventory.ts
var BlockInventory = class {
  constructor(inventory) {
    this.emptySlotsCount = inventory.emptySlotsCount;
    this.size = inventory.size;
    this.items = [];
    for (let i = 0; i < this.size; i++) {
      this.items[i] = inventory.getItem(i);
    }
  }
  load(block) {
    for (let i = 0; i < block.size; i++) {
      if (!this.items[i])
        continue;
      block.setItem(i, this.items[i]);
    }
  }
};

// src/index.ts
import {
  DynamicPropertiesDefinition,
  EntityTypes,
  ItemStack as ItemStack5,
  MinecraftItemTypes as MinecraftItemTypes3,
  system,
  world as world13
} from "mojang-minecraft";

// src/config/database.ts
import { BlockLocation as BlockLocation2 } from "mojang-minecraft";

// src/utils.ts
import {
  world,
  BlockLocation,
  MinecraftBlockTypes,
  MinecraftDimensionTypes
} from "mojang-minecraft";

// src/config/staff.ts
var STAFF_SCOREBOARD = "STAFF_DB";
var STAFF_DB_SCORES = {
  0: "member",
  1: "admin",
  2: "moderator",
  3: "builder"
};

// src/lang/text.ts
var text = {
  "api.name": () => "Smelly API",
  "api.error.unknown": () => "An unknown error has occured.",
  "api.database.error.table_name": (a, b) => `The display name ${a} is too long for an objective, it can be at most ${b} characters long`,
  "api.utilities.formatter.error.ms": (a) => `${a} is not a string or a number`,
  "api.Providers.form.invaildtype": (a, b) => `Type ${a} is not a vaild type to add a ${b}`,
  "api.Providers.form.invaildFormtype": (a, b) => {
    `The type ${a} is not a valid type, Vaild types: ${JSON.stringify(b)}`;
  },
  "api.ChestGUI.error.pagenotfound": (a) => `Page ${a} not found!`,
  "modules.protections.cps.clickingToFast": () => `You are clicking to fast! Please click slower!`,
  "modules.managers.mute.isMuted": () => `You are muted and cannot send messages please try again later`,
  "modules.commands.ban.reply": (playerName, length, unit, reason) => `\xA7cBanned \xA7f"\xA7a${playerName}\xA7f" \xA7cfor ${length} ${unit} Because: "${reason ?? "No reason Provided"}" \xA7aSuccessfully`
};

// src/config/region.ts
var DEFAULT_REGION_PERMISSIONS = {
  doorsAndSwitches: true,
  openContainers: true,
  pvp: false,
  allowedEntitys: ["minecraft:player", "minecraft:npc", "minecraft:item"]
};
var DOORS_SWITCHES = [
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
  "minecraft:lever"
];
var BLOCK_CONTAINERS2 = [
  "minecraft:chest",
  "minecraft:ender_chest",
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
  "minecraft:undyed_shulker_box"
];

// src/modules/models/Region.ts
var REGIONS = [];
var REGIONS_HAVE_BEEN_GRABBED = false;
var LOWEST_Y_VALUE = -64;
var HIGEST_Y_VALUE = 320;
function betweenXYZ(XYZa, XYZb, XYZc) {
  return XYZc.every(
    (c, i) => c >= Math.min(XYZa[i], XYZb[i]) && c <= Math.max(XYZa[i], XYZb[i])
  );
}
var Region = class {
  static getAllRegions() {
    if (REGIONS_HAVE_BEEN_GRABBED)
      return REGIONS;
    const regions = TABLES.regions.values().map(
      (region) => new Region(
        region.from,
        region.to,
        region.dimensionId,
        region.permissions,
        region.key
      )
    );
    regions.forEach((r) => {
      REGIONS.push(r);
    });
    return regions;
  }
  static blockLocationInRegion(blockLocation, dimensionId) {
    return this.getAllRegions().find(
      (region) => region.dimensionId == dimensionId && betweenXYZ(
        [region.from.x, LOWEST_Y_VALUE, region.from.z],
        [region.to.x, HIGEST_Y_VALUE, region.to.z],
        [blockLocation.x, blockLocation.y, blockLocation.z]
      )
    );
  }
  static removeRegionAtBlockLocation(blockLocation, dimensionId) {
    const region = this.blockLocationInRegion(blockLocation, dimensionId);
    if (!region)
      return false;
    return TABLES.regions.delete(region.key);
  }
  constructor(from, to, dimensionId, permissions, key) {
    this.from = from;
    this.to = to;
    this.dimensionId = dimensionId;
    this.permissions = permissions ?? DEFAULT_REGION_PERMISSIONS;
    this.key = key ? key : Date.now().toString();
    if (!key) {
      this.update();
      loadRegionDenys();
      REGIONS.push(this);
    }
  }
  update() {
    TABLES.regions.set(this.key, {
      key: this.key,
      from: this.from,
      dimensionId: this.dimensionId,
      permissions: this.permissions,
      to: this.to
    });
  }
  delete() {
    return TABLES.regions.delete(this.key);
  }
  entityInRegion(entity) {
    return this.dimensionId == entity.dimension.id && betweenXYZ(
      [this.from.x, LOWEST_Y_VALUE, this.from.z],
      [this.to.x, HIGEST_Y_VALUE, this.to.z],
      [entity.location.x, entity.location.y, entity.location.z]
    );
  }
  changePermission(key, value) {
    this.permissions[key] = value;
    this.update();
  }
};

// src/utils.ts
var DIMENSIONS = {
  overworld: world.getDimension(MinecraftDimensionTypes.overworld),
  nether: world.getDimension(MinecraftDimensionTypes.nether),
  theEnd: world.getDimension(MinecraftDimensionTypes.theEnd)
};
function kick(player, message = [], onFail) {
  try {
    player.runCommand(`kick "${player.nameTag}" \xA7r${message.join("\n")}`);
    player.triggerEvent("kick");
  } catch (error) {
    if (!/"statusCode":-2147352576/.test(error))
      return;
    if (onFail)
      onFail();
  }
}
function getScore(entity, objective) {
  try {
    return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
  } catch (error) {
    return 0;
  }
}
function getScoreByName(name, objective) {
  try {
    const command2 = DIMENSIONS.overworld.runCommand(
      `scoreboard players test "${name}" "${objective}" * *`
    );
    return parseInt(String(command2.statusMessage?.split(" ")[1]), 10);
  } catch (error) {
    return 0;
  }
}
function setScore(entityName, objective, value) {
  try {
    return DIMENSIONS.overworld.runCommand(
      `scoreboard players set "${entityName}" ${objective} ${value}`
    );
  } catch (error) {
    console.warn(error + error.stack);
  }
}
function getRole(player) {
  const score = typeof player == "string" ? getScoreByName(player, STAFF_SCOREBOARD) : getScore(player, STAFF_SCOREBOARD);
  return STAFF_DB_SCORES[score];
}
function setRole(playerName, value) {
  const num = parseInt(
    Object.keys(STAFF_DB_SCORES).find(
      (k) => STAFF_DB_SCORES[parseInt(k)] === value
    )
  );
  setScore(playerName, STAFF_SCOREBOARD, num);
}
function loadRegionDenys() {
  for (const region of Region.getAllRegions()) {
    const loc1 = new BlockLocation(region.from.x, -64, region.from.z);
    const loc2 = new BlockLocation(region.to.x, -64, region.to.z);
    for (const blockLocation of loc1.blocksBetween(loc2)) {
      DIMENSIONS[region.dimensionId].getBlock(blockLocation)?.setType(MinecraftBlockTypes.deny);
    }
  }
}
var CALLBACKS = {};
function forEachValidPlayer(callback, delay = 0) {
  const key = Date.now();
  CALLBACKS[key] = { callback, delay, lastCall: 0 };
  return key;
}
world.events.tick.subscribe((tick) => {
  const players = [...world.getPlayers()];
  for (const [i, player] of players.entries()) {
    if (["moderator", "admin"].includes(getRole(player)))
      return;
    for (const CALLBACK of Object.values(CALLBACKS)) {
      if (CALLBACK.delay != 0 && tick.currentTick - CALLBACK.lastCall < CALLBACK.delay)
        continue;
      CALLBACK.callback(player, tick);
      if (i == players.length - 1)
        CALLBACK.lastCall = tick.currentTick;
    }
  }
});
function runCommand(command2, dimension = "overworld", debug = false) {
  try {
    return debug ? console.warn(JSON.stringify(this.runCommand(command2))) : DIMENSIONS.overworld.runCommand(command2);
  } catch (error) {
    return { error: true };
  }
}
function getId(entity) {
  try {
    return entity.scoreboard.id.toString();
  } catch (error) {
    try {
      entity.runCommand("scoreboard objectives add test dummy");
    } catch (error2) {
    }
    try {
      entity.runCommand("scoreboard players add @s test 0");
    } catch (error2) {
    }
    return entity.scoreboard.id.toString();
  }
}
function MS(value, { compactDuration, fullDuration, avoidDuration } = {}) {
  try {
    if (typeof value === "string") {
      if (/^\d+$/.test(value))
        return Number(value);
      const durations = value.match(
        /-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi
      );
      return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
    }
    if (typeof value === "number")
      return toDuration(value, {
        compactDuration,
        fullDuration,
        avoidDuration
      });
    throw new Error(text["api.utilities.formatter.error.ms"](value));
  } catch (err) {
    const message = isError(err) ? `${err.message}. Value = ${JSON.stringify(value)}` : text["api.error.unknown"]();
    throw new Error(message);
  }
}
function toMS(value) {
  const number = Number(value.replace(/[^-.0-9]+/g, ""));
  value = value.replace(/\s+/g, "");
  if (/\d+(?=y)/i.test(value))
    return number * 3154e7;
  else if (/\d+(?=w)/i.test(value))
    return number * 6048e5;
  else if (/\d+(?=d)/i.test(value))
    return number * 864e5;
  else if (/\d+(?=h)/i.test(value))
    return number * 36e5;
  else if (/\d+(?=m)/i.test(value))
    return number * 6e4;
  else if (/\d+(?=s)/i.test(value))
    return number * 1e3;
  else if (/\d+(?=ms|milliseconds?)/i.test(value))
    return number;
  return 0;
}
function toDuration(value, { compactDuration, fullDuration, avoidDuration } = {}) {
  const absMs = Math.abs(value);
  const duration = [
    { short: "w", long: "week", duration: Math.floor(absMs / 6048e5) },
    { short: "d", long: "day", duration: Math.floor(absMs / 864e5) % 7 },
    { short: "h", long: "hour", duration: Math.floor(absMs / 36e5) % 24 },
    { short: "m", long: "minute", duration: Math.floor(absMs / 6e4) % 60 },
    { short: "s", long: "second", duration: Math.floor(absMs / 1e3) % 60 },
    { short: "ms", long: "millisecond", duration: absMs % 1e3 }
  ];
  const mappedDuration = duration.filter(
    (obj) => obj.duration !== 0 && avoidDuration ? fullDuration && !avoidDuration.map((v) => v.toLowerCase()).includes(obj.short) : obj.duration
  ).map(
    (obj) => `${Math.sign(value) === -1 ? "-" : ""}${compactDuration ? `${Math.floor(obj.duration)}${obj.short}` : `${Math.floor(obj.duration)} ${obj.long}${obj.duration === 1 ? "" : "s"}`}`
  );
  const result = fullDuration ? mappedDuration.join(compactDuration ? " " : ", ") : mappedDuration[0];
  return result || `${absMs}`;
}
function isError(error) {
  return typeof error === "object" && error !== null && "message" in error;
}
function locationToBlockLocation(loc) {
  return new BlockLocation(
    Math.floor(loc.x),
    Math.floor(loc.y),
    Math.floor(loc.z)
  );
}

// src/config/database.ts
var MAX_DATABASE_STRING_SIZE = 32e3;
var ENTITY_IDENTIFER = "rubedo:database";
var ENTITY_DIMENSION = DIMENSIONS.overworld;
var ENTITY_LOCATION = new BlockLocation2(0, -64, 0);

// src/lib/Database/Database.ts
import {
  ItemStack,
  MinecraftItemTypes
} from "mojang-minecraft";

// src/lib/Database/utils.ts
function chunkString(str, length) {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}

// src/lib/Database/Database.ts
var Database = class {
  static compress(string) {
    return string;
  }
  static decompress(string) {
    return string;
  }
  static createEntity(name, index) {
    let entity = ENTITY_DIMENSION.spawnEntity(
      ENTITY_IDENTIFER,
      ENTITY_LOCATION
    );
    entity.setDynamicProperty("name", name);
    entity.setDynamicProperty("index", index);
    const inv = entity.getComponent("inventory").container;
    const defaultItem = new ItemStack(MinecraftItemTypes.acaciaBoat, 1);
    if (index == 0)
      defaultItem.nameTag = "{}";
    inv.setItem(0, defaultItem);
    return entity;
  }
  static getInventorySlotName(entity, slot) {
    const inv = entity.getComponent("inventory").container;
    return inv.getItem(slot)?.nameTag;
  }
  static setInventorySlotName(entity, slot, value) {
    const inv = entity.getComponent("inventory").container;
    let item = inv.getItem(slot);
    item.nameTag = value;
    return inv.setItem(slot, item);
  }
  constructor(name) {
    this.name = name;
    this.savedEntitys = void 0;
    this.MEMORY = void 0;
  }
  get entitys() {
    if (this.savedEntitys)
      return this.savedEntitys;
    const ens = ENTITY_DIMENSION.getEntitiesAtBlockLocation(
      ENTITY_LOCATION
    ).filter(
      (e) => e.id == ENTITY_IDENTIFER && e.getDynamicProperty("name") == this.name
    );
    this.savedEntitys = ens;
    return ens;
  }
  data() {
    if (this.MEMORY)
      return this.MEMORY;
    if (this.entitys.length == 0)
      Database.createEntity(this.name, 0);
    if (this.entitys.length == 1) {
      let data2 = JSON.parse(
        Database.decompress(Database.getInventorySlotName(this.entitys[0], 0))
      );
      this.MEMORY = data2;
      return data2;
    }
    let data = new Array(this.entitys.length);
    for (const entity of this.entitys) {
      let index = entity.getDynamicProperty("index");
      data[index] = Database.getInventorySlotName(entity, 0);
    }
    try {
      data = JSON.parse(data.join(""));
    } catch (error) {
      data = {};
    }
    this.MEMORY = data;
    return data;
  }
  save(data) {
    this.MEMORY = data;
    const dataSplit = chunkString(
      Database.compress(JSON.stringify(data)),
      MAX_DATABASE_STRING_SIZE
    );
    if (this.entitys && dataSplit.length == this.entitys.length) {
      for (let i = 0; i < dataSplit.length; i++) {
        Database.setInventorySlotName(this.entitys[i], 0, dataSplit[i]);
      }
    } else {
      this.entitys?.forEach((e) => e?.triggerEvent("despawn"));
      this.savedEntitys = void 0;
      for (let i = 0; i < dataSplit.length; i++) {
        const entity = Database.createEntity(this.name, i);
        Database.setInventorySlotName(entity, 0, dataSplit[i]);
      }
    }
  }
  set(key, value) {
    const data = this.data();
    data[key] = value;
    this.save(data);
  }
  get(key) {
    return this.data()[key];
  }
  has(key) {
    return this.keys().includes(key);
  }
  delete(key) {
    let data = this.data();
    const status = delete data[key];
    this.save(data);
    return status;
  }
  size() {
    return this.keys().length;
  }
  clear() {
    this.save({});
  }
  keys() {
    return Object.keys(this.data());
  }
  values() {
    return Object.values(this.data());
  }
  getCollection() {
    return this.data();
  }
};

// src/lib/Scheduling/Timeout.ts
import { world as world2 } from "mojang-minecraft";
var TIMEOUTS = /* @__PURE__ */ new Map();
var Timeout = class {
  constructor(callback, tick, loop = false, id = Date.now()) {
    this.callbackTick = null;
    this.tickDelay = tick;
    this.loop = loop;
    this.callback = callback;
    this.id = id;
    TIMEOUTS.set(id, this);
    this.TickCallBack = world2.events.tick.subscribe(({ currentTick }) => {
      if (!this.callbackTick)
        this.callbackTick = currentTick + this.tickDelay;
      if (this.callbackTick > currentTick)
        return;
      this.callback(currentTick);
      if (!this.loop)
        return this.expire();
      this.callbackTick = currentTick + this.tickDelay;
    });
  }
  expire() {
    world2.events.tick.unsubscribe(this.TickCallBack);
    TIMEOUTS.delete(this.id);
  }
};

// src/lib/Scheduling/utils.ts
var sleep = (tick) => {
  return new Promise((resolve) => setTickTimeout(resolve, tick));
};
function setTickTimeout(callback, tick) {
  new Timeout(callback, tick);
}
function setTickInterval(callback, tick) {
  return new Timeout(callback, tick, true);
}

// src/lib/Commands/index.ts
import { world as world4 } from "mojang-minecraft";

// src/config/commands.ts
var PREFIX = "-";

// src/lib/Commands/Callback.ts
var CommandCallback = class {
  constructor(data, args) {
    this.data = data;
    this.args = args;
    this.sender = data.sender;
  }
  reply(text2) {
    this.sender.tell(text2);
  }
  run(command2) {
    try {
      this.sender.runCommand(command2);
    } catch (error) {
    }
  }
  invalidArg(arg) {
    this.sender.tell({
      translate: `commands.generic.parameter.invalid`,
      with: [arg]
    });
  }
  invalidPermission() {
    this.sender.tell({
      translate: `commands.generic.permission.selector`
    });
  }
  give(item) {
    const inventory = this.sender.getComponent("minecraft:inventory").container;
    inventory.addItem(item);
  }
};

// src/lib/Commands/utils.ts
import { BlockLocation as BlockLocation3, world as world3 } from "mojang-minecraft";
function parseLocationAugs([x, y, z], { location, viewVector }) {
  if (!x || !y || !x)
    return null;
  const a = [x, y, z].map((arg) => {
    const r = parseInt(arg.replace(/\D/g, ""));
    return isNaN(r) ? 0 : r;
  });
  const b = [x, y, z].map((arg, index) => {
    return arg.includes("~") ? a[index] + location[index] : arg.includes("^") ? a[index] + viewVector[index] : a[index];
  });
  return new BlockLocation3(b[0], b[1], b[2]);
}
function fetch(playerName) {
  return [...world3.getPlayers()].find((plr) => plr.name === playerName);
}

// src/lib/Commands/OptionTypes.ts
var DefaultType = class {
};
DefaultType.fail = "commands.generic.parameter.invalid";
DefaultType.validate = (value) => value && value != "";
DefaultType.parse = (value) => value;
var IntegerOption = class {
};
IntegerOption.fail = "commands.generic.num.invalid";
IntegerOption.validate = (value) => !isNaN(value);
IntegerOption.parse = (value) => parseInt(value);
var FloatOption = class {
};
FloatOption.fail = IntegerOption.fail;
FloatOption.validate = (value) => value?.match(/^\d+\.\d+$/)?.[0];
FloatOption.parse = (value) => parseFloat(value);
var LocationOption = class {
};
LocationOption.fail = IntegerOption.fail;
LocationOption.validate = (value) => value?.match(/^([\~\^]{1})?([-]?\d*)$/)?.[0];
LocationOption.parse = (value) => value;
var BooleanOption = class {
};
BooleanOption.fail = "commands.generic.boolean.invalid";
BooleanOption.validate = (value) => value?.match(/^(true|false)$/)?.[0];
BooleanOption.parse = (value) => value == "true" ? true : false;
var PlayerOption = class {
};
PlayerOption.fail = "commands.generic.player.notFound";
PlayerOption.validate = (value) => fetch(value) ? true : false;
PlayerOption.parse = (value) => fetch(value);
var TargetOption = class {
};
TargetOption.fail = "commands.generic.player.notFound";
TargetOption.validate = (value) => value?.match(/^(@.|"[\s\S]+")$/)?.[0];
TargetOption.parse = (value) => value;
var ArrayOption = class {
};
ArrayOption.fail = "commands.generic.parameter.invalid";
ArrayOption.validate = (value, types) => types.includes(value);
ArrayOption.parse = (value) => value;
var OptionTypes = {
  string: DefaultType,
  int: IntegerOption,
  float: FloatOption,
  location: LocationOption,
  boolean: BooleanOption,
  player: PlayerOption,
  target: TargetOption,
  array: ArrayOption
};

// src/lib/Commands/Options.ts
var CommandOption = class {
  constructor(name, type, description, optional = false) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.optional = optional;
  }
  verify(value) {
    if (Array.isArray(this.type))
      return OptionTypes.array.validate(value, this.type);
    return OptionTypes[this.type].validate(value);
  }
  validate(value) {
    if (Array.isArray(this.type))
      return value;
    return OptionTypes[this.type].parse(value);
  }
};

// src/lib/Commands/Command.ts
var DEFAULT_HAS_PERMISSION = (player) => true;
function getChatCommand(data) {
  const args = getChatAugments(data);
  let checker = (arr, target) => target.every((v, index) => v === arr[index]);
  let command2 = null;
  const cmds = {};
  for (const command3 of COMMAND_PATHS) {
    cmds[command3.path.toString()] = command3;
    for (const aliase of command3.aliases) {
      let p = [...command3.path];
      p[0] = aliase;
      cmds[p.toString()] = command3;
    }
    if (command3.path.length > 1) {
      const a = COMMAND_PATHS.find((cmd) => cmd.name == command3.path[0]);
      for (const aliase of a.aliases) {
        let p = [...command3.path];
        p[0] = aliase;
        cmds[p.toString()] = command3;
      }
    }
  }
  for (let [path, cmd] of Object.entries(cmds)) {
    const pathA = path.split(",");
    if (checker(args, pathA))
      command2 = cmd;
  }
  return command2;
}
function getChatAugments(data) {
  return data.message.slice(PREFIX.length).trim().match(/"[^"]+"|[^\s]+/g).map((e) => e.replace(/"(.+)"/, "$1").toString());
}
var Command = class {
  constructor(CommandInfo, callback) {
    this.name = CommandInfo.name.toString().toLowerCase();
    this.description = CommandInfo.description;
    this.aliases = CommandInfo.aliases ?? [];
    this.tags = CommandInfo.tags ?? [];
    this.hasPermission = CommandInfo.hasPermission ?? DEFAULT_HAS_PERMISSION;
    this.path = CommandInfo.path ?? [this.name];
    this.permissions = CommandInfo.permissions ?? [];
    this.options = [];
    this.callback = callback;
    COMMAND_PATHS.push(this);
  }
  addSubCommand(SubCommandInfo, callback) {
    const newPath = [...this.path];
    newPath.push(SubCommandInfo.name);
    const subCommand = new Command(
      {
        name: SubCommandInfo.name,
        description: SubCommandInfo.description,
        tags: SubCommandInfo.tags,
        hasPermission: SubCommandInfo.hasPermission,
        path: newPath
      },
      callback
    );
    return subCommand;
  }
  addOption(name, type, description, optional = false) {
    if (type == "location") {
      this.options.push({
        name,
        type: "location",
        description,
        optional,
        x: new CommandOption(`x${Date.now()}`, type, description, optional),
        y: new CommandOption(`y${Date.now()}`, type, description, optional),
        z: new CommandOption(`z${Date.now()}`, type, description, optional)
      });
      return this;
    }
    this.options.push(new CommandOption(name, type, description, optional));
    return this;
  }
  getName() {
    return this.name;
  }
  sendCallback(data, args) {
    if (!this.callback)
      return;
    const options = {};
    for (const [i, option] of this.options.entries()) {
      if (option.type == "location") {
        options[option.name] = parseLocationAugs(
          [args[i], args[i + 1], args[i + 2]],
          {
            location: [
              data.sender.location.x,
              data.sender.location.y,
              data.sender.location.z
            ],
            viewVector: [
              data.sender.viewVector.x,
              data.sender.viewVector.y,
              data.sender.viewVector.z
            ]
          }
        );
        continue;
      }
      options[option.name] = option.validate(args[i]);
    }
    this.callback(new CommandCallback(data, args), options);
  }
  executes(callback) {
    this.callback = callback;
    return this;
  }
};

// src/lib/Commands/index.ts
var COMMAND_PATHS = [];
world4.events.beforeChat.subscribe((data) => {
  try {
    if (!data.message.startsWith(PREFIX))
      return;
    data.cancel = true;
    let args = getChatAugments(data);
    const command2 = getChatCommand(data);
    if (!command2 || !command2.callback)
      return data.sender.tell({
        translate: `commands.generic.unknown`,
        with: [`\xA7f${args[0]}\xA7c`]
      });
    if (!command2.tags.every((tag) => data.sender.hasTag(tag)) || !command2.hasPermission(data.sender))
      return data.sender.tell(`You do not have permission to use this command`);
    args.shift();
    args = args.filter((el) => !command2.path.includes(el));
    for (let [index, option] of command2.options.entries()) {
      if (option.type == "location") {
        if (option.x.verify(args[index])) {
          if (args?.[index + 1] && option.y.verify(args[index + 1])) {
            if (args?.[index + 2] && option.z.verify(args[index + 2])) {
              continue;
            } else {
              index += 2;
            }
          } else {
            index += 1;
          }
        }
      } else {
        if (option.verify(args[index]))
          continue;
      }
      if (option.optional)
        break;
      return data.sender.tell({
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${command2.path.join(" ")} ${args.slice(0, index).join(" ")}`,
          args[index],
          args.slice(index + 1).join(" ")
        ]
      });
    }
    command2.sendCallback(data, args);
  } catch (error) {
    console.warn(`${error} : ${error.stack}`);
    data.cancel = false;
  }
});

// src/lib/Chest GUI/index.ts
import { world as world6 } from "mojang-minecraft";

// src/config/chest.ts
var GUI_ITEM = "rubedo:gui";
var ENTITY_INVENTORY = "rubedo:inventory";
var DEFAULT_STATIC_PAGE_ID = "home";

// src/lib/Chest GUI/Models/ChestGUI.ts
import { world as world5 } from "mojang-minecraft";

// src/lib/Chest GUI/pages.ts
var PAGES = {};

// src/lib/Chest GUI/Models/FillTypes.ts
function DefaultFill(entity, page, extras) {
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
}

// src/lib/Chest GUI/Models/Page.ts
function getItemUid(item) {
  let uid = "";
  if (item) {
    let { id, nameTag, amount, data } = item;
    uid = [id, nameTag, amount, data].join("");
  }
  return uid;
}
var Page = class {
  constructor(id, size, fillType = DefaultFill) {
    if (size % 9 != 0)
      throw new Error("Size needs to be in a increment of 9");
    if (PAGES[id])
      throw new Error(`Id of ${id} Already exsists`);
    this.id = id;
    this.size = size;
    this.slots = Array(this.size);
    this.fillType = fillType;
    PAGES[id] = this;
  }
  setSlots(slot, item, action) {
    const data = item ? { item, action } : null;
    for (const i of slot) {
      this.slots[i] = data;
    }
    return this;
  }
  setButtonAtSlot(slot, button) {
    this.slots[slot] = { item: button.Item, action: button.Action };
    return this;
  }
};

// src/lib/Chest GUI/Models/ItemGrabbedCallback.ts
var ItemGrabbedCallback = class {
  constructor(gui, slot, change) {
    this.gui = gui;
    this.slot = slot;
    this.change = change;
  }
  message(text2) {
    this.gui.player.tell(text2);
  }
  getItemAdded() {
    if (this.slot.item)
      return null;
    return this.gui.entity.getComponent("minecraft:inventory").container.getItem(this.change.slot);
  }
  GiveAction(item = this.slot.item.itemStack) {
    this.gui.player.getComponent("minecraft:inventory").container.addItem(item);
  }
  TakeAction(db = null) {
    this.gui.player.getComponent("minecraft:inventory").container.addItem(this.slot.item.itemStack);
    this.gui.page.slots[this.change.slot] = null;
    if (!db)
      return;
    db.delete(this.slot.item.components.dbKey);
  }
  PageAction(page, extras) {
    this.gui.setPage(page, extras);
  }
  BackAction(amount = 1) {
    if (this.gui.pageHistory.length < amount)
      return new Error(`Tried to Go back to a page number that doesnt exist`);
    console.warn(JSON.stringify(this.gui.pageHistory));
    const pageID = this.gui.pageHistory.splice(-1 - amount)[0];
    console.warn(JSON.stringify(this.gui.page.extras));
    this.PageAction(pageID, this.gui.page.extras);
  }
  CloseAction() {
    this.gui.kill();
  }
  SetAction() {
    const container = this.gui.entity.getComponent(
      "minecraft:inventory"
    ).container;
    container.setItem(this.change.slot, this.slot.item.itemStack);
  }
  async FormAction(form) {
    this.CloseAction();
    await sleep(5);
    return await form.show(this.gui.player);
  }
};

// src/lib/Chest GUI/utils.ts
import {
  MinecraftDimensionTypes as MinecraftDimensionTypes2
} from "mojang-minecraft";
async function clearPlayersPointer(player, ItemToClear) {
  try {
    const inventory = player.getComponent("minecraft:inventory").container;
    let itemsToLoad = [];
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (!item)
        continue;
      if (item?.id == ItemToClear?.id) {
        itemsToLoad.push({ slot: i, item });
        inventory.setItem;
        if (i < 9) {
          player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`);
        } else {
          player.runCommand(
            `replaceitem entity @s slot.inventory ${i - 9} air`
          );
        }
      }
    }
    player.runCommand(
      `clear @s ${ItemToClear?.id} ${ItemToClear.data} ${ItemToClear.amount}`
    );
    for (const item of itemsToLoad) {
      inventory.setItem(item.slot, item.item);
    }
  } catch (error) {
    console.warn(error + error.stack);
    [
      ...player.dimension.getEntities({
        type: "minecraft:item",
        location: player.location,
        maxDistance: 2,
        closest: 1
      })
    ].forEach((e) => e.kill());
  }
}
function getItemAtSlot(entity, slot) {
  const inventory = entity.getComponent("minecraft:inventory").container;
  return inventory.getItem(slot);
}
function getEntitys(type) {
  let entitys = [];
  for (const dimension of Object.keys(MinecraftDimensionTypes2)) {
    [...DIMENSIONS[dimension].getEntities()].forEach(
      (e) => entitys.push(e)
    );
  }
  if (type)
    return entitys.filter((e) => e?.id == type);
  return entitys;
}
function getHeldItem(player) {
  const inventory = player.getComponent(
    "minecraft:inventory"
  ).container;
  return inventory.getItem(player.selectedSlot);
}

// src/lib/Chest GUI/Models/ChestGUI.ts
var CURRENT_GUIS = {};
var ChestGUI = class {
  static getEntitysGuiInstance(entity) {
    return Object.values(CURRENT_GUIS).find((gui) => gui.entity == entity);
  }
  static getSlotChange(oldInv, newInv) {
    if (oldInv.length != newInv.length)
      return null;
    for (let i = 0; i < oldInv.length; i++) {
      if (oldInv[i].uid != newInv[i].uid)
        return { slot: i, item: oldInv[i].item };
    }
    return null;
  }
  constructor(player, entity) {
    this.player = player;
    this.playersName = player.name;
    this.entity = entity;
    this.previousMap = null;
    this.HAS_CONTAINER_OPEN = false;
    this.pageHistory = [];
    this.extras = null;
    this.page = null;
    this.loops = [];
    if (!this.entity)
      this.summon();
    this.events = {
      tick: world5.events.tick.subscribe(() => {
        try {
          if (!this.HAS_CONTAINER_OPEN)
            return;
          if (!this.previousMap)
            return;
          for (const loop of this.loops) {
            loop();
          }
          const change = ChestGUI.getSlotChange(
            this.previousMap,
            this.mapInventory
          );
          if (change == null)
            return;
          this.onSlotChange(change);
        } catch (error) {
          console.warn(error + error.stack);
        }
      }),
      playerLeave: world5.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName != this.playersName)
          return;
        this.kill();
      }),
      beforeDataDrivenEntityTriggerEvent: world5.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
        if (![
          "rubedo:has_container_open",
          "rubedo:dosent_have_container_open"
        ].includes(data.id))
          return;
        if (data.entity.nameTag != this.player.nameTag)
          return;
        if (data.id == "rubedo:has_container_open")
          return this.HAS_CONTAINER_OPEN = true;
        this.HAS_CONTAINER_OPEN = false;
      })
    };
    CURRENT_GUIS[this.playersName] = this;
  }
  summon() {
    try {
      getEntitys(ENTITY_INVENTORY)?.find((e2) => e2.getTags().includes(`id:${this.playersName}`))?.triggerEvent("despawn");
      let e = world5.events.entityCreate.subscribe((data) => {
        if (data.entity?.id == ENTITY_INVENTORY) {
          this.entity = data.entity;
          this.entity.addTag(`id:${this.playersName}`);
          this.setPage(DEFAULT_STATIC_PAGE_ID);
        }
        world5.events.entityCreate.unsubscribe(e);
      });
      this.player.triggerEvent("rubedo:spawn_inventory");
    } catch (error) {
      console.warn(error + error.stack);
    }
  }
  reload() {
    this.entity.triggerEvent("despawn");
    this.summon();
  }
  kill() {
    try {
      this.entity?.triggerEvent("despawn");
    } catch (error) {
    }
    for (const key in this.events) {
      world5.events[key].unsubscribe(this.events[key]);
    }
    delete CURRENT_GUIS[this.playersName];
  }
  setPage(id, extras) {
    this.extras = extras;
    this.pageHistory.push(id);
    this.loops = [];
    const page = PAGES[id];
    if (!page)
      return new Error(
        text["api.ChestGUI.error.pagenotfound"](id ?? "Undefined")
      );
    page.fillType(this.entity, page, extras);
    this.page = page;
    this.previousMap = this.mapInventory;
    this.entity.nameTag = `size:${page.size}` ?? "size:27";
  }
  get mapInventory() {
    let container = this.entity.getComponent("inventory").container;
    let inventory = [];
    for (let i = 0; i < container.size; i++) {
      let currentItem = container.getItem(i);
      inventory.push({
        uid: getItemUid(currentItem),
        item: currentItem
      });
    }
    this.previousMap = inventory;
    return inventory;
  }
  onSlotChange(change) {
    const slot = this.page.slots[change.slot];
    if (!slot) {
      this.entity.runCommand(
        `replaceitem entity @s slot.inventory ${change.slot} air`
      );
    } else {
      if (slot.item)
        clearPlayersPointer(this.player, slot.item);
      if (!slot.item && !getItemAtSlot(this.entity, change.slot))
        return;
      this.runItemAction(slot, change);
    }
    this.previousMap = this.mapInventory;
  }
  runItemAction(slot, change) {
    if (!slot.action)
      return;
    slot.action(new ItemGrabbedCallback(this, slot, change));
  }
  registerLoop(callback) {
    this.loops.push(callback);
  }
};

// src/lib/Chest GUI/Models/Item.ts
import {
  Items,
  ItemStack as ItemStack4,
  MinecraftEnchantmentTypes
} from "mojang-minecraft";
var Item = class {
  static itemStackToItem(item, extras = {}) {
    const enchantments2 = item.getComponent("enchantments").enchantments;
    const ItemStackEnchantments = [];
    for (const Enchantment2 in MinecraftEnchantmentTypes) {
      const ItemEnchantment = enchantments2.getEnchantment(
        MinecraftEnchantmentTypes[Enchantment2]
      );
      if (!ItemEnchantment)
        continue;
      ItemStackEnchantments.push(
        MinecraftEnchantmentTypes[Enchantment2]
      );
    }
    return new Item(item.id, item.amount, item.data, {
      nameTag: item.nameTag,
      lore: item.getLore(),
      enchantments: ItemStackEnchantments
    });
  }
  constructor(id, amount = 1, data = 0, components = {}, itemStack) {
    this.id = id;
    this.amount = amount;
    this.data = data;
    this.components = components;
    this.itemStack = itemStack ? itemStack : new ItemStack4(Items.get(this.id), amount, data);
  }
  setComponents(components = this.components) {
    this.components = components;
    if (components?.nameTag)
      this.itemStack.nameTag = components.nameTag;
    if (this.components?.lore)
      this.itemStack.setLore(this.components.lore);
    if (components?.enchantments?.length > 0) {
      const ItemStackEnchantments = this.itemStack.getComponent("enchantments").enchantments;
      for (const ench of components.enchantments) {
        ItemStackEnchantments.addEnchantment(ench);
      }
      this.itemStack.getComponent("enchantments").enchantments = ItemStackEnchantments;
    }
    return this.itemStack;
  }
};

// src/lib/Chest GUI/Models/Buttons.ts
var BackButton = class {
};
BackButton.Item = new Item("minecraft:arrow", 1, 0, {
  nameTag: "\xA7fBack"
});
BackButton.Action = (ctx) => {
  ctx.BackAction();
};
var CloseGuiButton = class {
};
CloseGuiButton.Item = new Item("minecraft:barrier", 1, 0, {
  nameTag: "\xA7cClose GUI"
});
CloseGuiButton.Action = (ctx) => {
  ctx.CloseAction();
};

// src/lib/Chest GUI/static_pages.ts
var HOME_PAGE = new Page("home", 54, DefaultFill).setSlots(
  [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    17,
    18,
    26,
    27,
    35,
    36,
    44,
    45,
    46,
    47,
    48,
    50,
    51,
    52,
    53
  ],
  new Item("minecraft:stained_glass_pane", 1, 15, {
    nameTag: "\xA7r"
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [22],
  new Item("minecraft:ender_chest", 1, 0, {
    nameTag: "\xA7l\xA7bInventory Viewer"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setButtonAtSlot(49, CloseGuiButton);

// src/lib/Chest GUI/index.ts
world6.events.tick.subscribe(() => {
  for (const player of world6.getPlayers()) {
    if (getRole(player) != "admin")
      continue;
    if (getHeldItem(player)?.id != GUI_ITEM)
      return;
    let PLAYERS_GUI = CURRENT_GUIS[player.name];
    if (!PLAYERS_GUI)
      CURRENT_GUIS[player.name] = new ChestGUI(player);
  }
});
world6.events.tick.subscribe(() => {
  for (const gui of Object.values(CURRENT_GUIS)) {
    if (!gui.entity?.id)
      continue;
    try {
      const health = gui.entity.getComponent("minecraft:health");
      if (health.current <= 0)
        return gui.kill();
    } catch (error) {
      gui.kill();
    }
    if (getHeldItem(gui.player)?.id != GUI_ITEM)
      return gui.kill();
    if (!gui.player)
      return gui.kill();
    gui.entity.teleport(gui.player.location, gui.player.dimension, 0, 0);
  }
});

// src/modules/models/Ban.ts
var Ban = class {
  constructor(player, length, unit, reason = "No Reason", by = "Smelly Anti Cheat") {
    length = length ? MS(`${length} ${unit}`) : null;
    const data = {
      key: getId(player),
      player: player.name,
      date: Date.now(),
      length,
      expire: length ? length + Date.now() : null,
      reason,
      by
    };
    TABLES.bans.set(getId(player), data);
  }
};

// src/modules/commands/ban.ts
new Command({
  name: "ban",
  description: "Ban players for lengths",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("player", "player", "Player to ban").addOption("length", "int", "Time ammount to ban").addOption("unit", "string", "The unit for the time").addOption("reason", "string", "reason for ban", true).executes((ctx, { player, length, unit, reason }) => {
  new Ban(player, length, unit, reason, ctx.sender.name);
  ctx.reply(
    text["modules.commands.ban.reply"](player.name, length, unit, reason)
  );
});

// src/config/enchantments.ts
var ENCHANTMENTS = {
  aquaAffinity: 1,
  baneOfArthropods: 5,
  binding: 1,
  blastProtection: 4,
  channeling: 1,
  depthStrider: 3,
  efficiency: 5,
  featherFalling: 4,
  fireAspect: 2,
  fireProtection: 4,
  flame: 1,
  fortune: 3,
  frostWalker: 2,
  impaling: 5,
  infinity: 1,
  knockback: 2,
  looting: 3,
  loyalty: 4,
  luckOfTheSea: 3,
  lure: 3,
  mending: 1,
  multishot: 1,
  piercing: 4,
  power: 5,
  projectileProtection: 4,
  protection: 4,
  punch: 2,
  quickCharge: 3,
  respiration: 3,
  riptide: 3,
  sharpness: 5,
  silkTouch: 1,
  smite: 5,
  soulSpeed: 3,
  swiftSneak: 4,
  thorns: 3,
  unbreaking: 3,
  vanishing: 1
};

// src/modules/commands/config.ts
var config = new Command({
  name: "config",
  description: "Opens up a form to configure rubedo",
  hasPermission: (player) => getRole(player) == "admin"
});
var banned = config.addSubCommand({
  name: "banned",
  description: "Manages banned items/blocks on this server",
  hasPermission: (player) => getRole(player) == "admin"
});
var bannedItems = banned.addSubCommand({
  name: "items",
  description: "Manages the banned items on this server",
  hasPermission: (player) => getRole(player) == "admin"
});
bannedItems.addSubCommand({
  name: "add",
  description: "Adds a item to the banned items list",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("item", "string", "item to add make sure it is prefix:item").executes((ctx, { item }) => {
  let items = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
  if (!items.includes(item))
    items.push(item);
  TABLES.config.set("banned_items", items);
  ctx.reply(`Banned the item "${item}"`);
});
bannedItems.addSubCommand({
  name: "remove",
  description: "Removes a item from the banned items list",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("item", "string", "item to remove make sure it is prefix:item").executes((ctx, { item }) => {
  let items = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
  if (!items.includes(item))
    return ctx.reply(`item: "${item}" is not banned`);
  items = items.filter((p) => p != item);
  TABLES.config.set("banned_items", items);
  ctx.reply(`Removed Banned item "${item}"`);
});
var bannedBlocks = banned.addSubCommand({
  name: "blocks",
  description: "Manages the banned blocks on this server",
  hasPermission: (player) => getRole(player) == "admin"
});
bannedBlocks.addSubCommand({
  name: "add",
  description: "Adds a block to the banned blocks list",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("block", "string", "item to add make sure it is prefix:block").executes((ctx, { block }) => {
  let blocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
  if (!blocks.includes(block))
    blocks.push(block);
  TABLES.config.set("banned_blocks", block);
  ctx.reply(`Banned the block "${block}"`);
});
bannedBlocks.addSubCommand({
  name: "remove",
  description: "Removes a block from the banned blocks list",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("block", "string", "block to remove make sure it is prefix:block").executes((ctx, { block }) => {
  let blocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
  if (!blocks.includes(block))
    return ctx.reply(`block: "${block}" is not banned`);
  blocks = blocks.filter((p) => p != block);
  TABLES.config.set("banned_blocks", block);
  ctx.reply(`Removed Banned block "${block}"`);
});
var enchantments = config.addSubCommand({
  name: "enchantments",
  description: "Manages the maxEnchants on this srrver",
  hasPermission: (player) => getRole(player) == "admin"
});
enchantments.addSubCommand({
  name: "set",
  description: "Sets a enchantment to a level",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("enchantment", Object.keys(ENCHANTMENTS), "enchantment to change").addOption("level", "int", "Max level to change the enchantment to").executes(
  (ctx, { enchantment, level }) => {
    let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    enchants[enchantment] = level;
    TABLES.config.set("enchantments", enchants);
    ctx.reply(`Set max level for ${enchantment} to ${level}`);
  }
);
enchantments.addSubCommand({
  name: "get",
  description: "Gets the max level for a enchantment",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("enchantment", Object.keys(ENCHANTMENTS), "enchantment to change").executes((ctx, { enchantment }) => {
  let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
  ctx.reply(`Max level for ${enchantment} is ${enchants[enchantment]}`);
});
config.addSubCommand({
  name: "setAppealLink",
  description: "Sets the appeal link for this server",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("link", "string", "the link to have people go to, to appeal").executes((ctx, { link }) => {
  TABLES.config.set("appealLink", link);
  ctx.reply(`Changed the servers appeal link to ${link}`);
});

// src/modules/commands/database.ts
var dbcm = new Command({
  name: "database",
  description: "Interacts with SA Database",
  aliases: ["db"],
  hasPermission: (player) => getRole(player) == "admin"
});
dbcm.addSubCommand({
  name: "get",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("table", "string", "Table to grab from").addOption("key", "string", "Key to grab").executes((ctx, { table, key }) => {
  try {
    const data = TABLES[table].get(key);
    if (data) {
      ctx.reply(data);
    } else {
      ctx.reply(`No data could be found for key ${key}`);
    }
  } catch (error) {
    ctx.reply(error + error.stack);
  }
});
dbcm.addSubCommand({
  name: "set",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("table", "string", "Table to set to").addOption("key", "string", "Key to set").addOption("value", "string", "Value to assign to the key").executes(
  (ctx, { table, key, value }) => {
    try {
      TABLES[table].set(key, value);
      ctx.reply(
        `Set Key: "${key}", to value: "${value}" on table: "${table}"`
      );
    } catch (error) {
      ctx.reply(error + error.stack);
    }
  }
);
dbcm.addSubCommand({
  name: "clear",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("table", "string", "Table to set to").executes((ctx, { table }) => {
  try {
    TABLES[table].clear();
    ctx.reply(`Cleared Table ${table}`);
  } catch (error) {
    ctx.reply(error + error.stack);
  }
});

// src/modules/commands/ecwipe.ts
new Command({
  name: "ecwipe",
  description: "Clears a players ender chest",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("player", "player", "Player to clear").executes((ctx, { player }) => {
  for (let i = 0; i < 27; i++) {
    player.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
  }
  ctx.reply(`Cleared ${player.name} Ender chest!`);
});

// src/modules/models/Freeze.ts
var Freeze = class {
  constructor(player, reason = "No Reason") {
    const data = {
      player: player.name,
      key: getId(player),
      reason,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
        dimension: player.dimension.id
      }
    };
    TABLES.freezes.set(getId(player), data);
  }
};

// src/modules/commands/freeze.ts
new Command({
  name: "freeze",
  description: "Freeze a player",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("player", "player", "Player to ban").addOption("reason", "string", "reason for ban", true).executes((ctx, { player, reason }) => {
  new Freeze(player, reason);
  ctx.reply(
    `\xA7cFroze \xA7f"\xA7a${player.name}\xA7f" Because: "${reason ?? "No reason Provided"}" \xA7aSuccessfully`
  );
  ctx.sender.tell(
    `\xA7cYou have been frozen by \xA7f"\xA7a${ctx.sender.nameTag}\xA7f" Because: "${reason ?? "No reason Provided"}"`
  );
});

// src/modules/commands/help.ts
new Command(
  {
    name: "help",
    description: "Provides help/list of commands.",
    aliases: ["?", "h"]
  },
  (ctx) => {
    if (COMMAND_PATHS.length == 0)
      return ctx.reply(`No Commands Found`);
    const ALL_COMMANDS = COMMAND_PATHS.filter(
      (command2) => command2.callback && command2.hasPermission(ctx.sender)
    );
    let page = 1;
    const maxPages = Math.ceil(ALL_COMMANDS.length / 10);
    const arg = ctx.args[0];
    if (arg) {
      if (!isNaN(parseInt(arg))) {
        page = parseInt(arg);
      } else {
        const cmd = ALL_COMMANDS.find((cmd2) => cmd2.path.includes(arg));
        if (!cmd)
          return ctx.reply(`The command ${arg} does not exist`);
        ctx.sender.tell({
          rawtext: [
            {
              translate: `commands.help.command.aliases`,
              with: [cmd.name, cmd.aliases.join(", ")]
            }
          ]
        });
        ctx.reply(cmd.description);
        ctx.reply(`Usage: 
`);
        for (const command2 of ALL_COMMANDS.filter(
          (c) => c.path[0] == ctx.args[0]
        )) {
          const options = command2.options.map(
            (option) => `${option.optional ? "[" : "<"}${option.name}: ${option.type}${option.optional ? "]" : ">"}`
          );
          ctx.reply(`-${command2.path.join(" ")} ${options.join(" ")}`);
        }
        return;
      }
    }
    if (page > maxPages)
      page = maxPages;
    ctx.sender.tell({
      rawtext: [
        {
          translate: `commands.help.header`,
          with: [page.toString(), maxPages.toString()]
        }
      ]
    });
    for (const command2 of ALL_COMMANDS.slice(page * 10 - 10, page * 10)) {
      const options = command2.options.map(
        (option) => `${option.optional ? "[" : "<"}${option.name}: ${option.type}${option.optional ? "]" : ">"}`
      );
      ctx.reply(`-${command2.path.join(" ")} ${options.join(" ")}`);
    }
  }
);

// src/modules/models/Mute.ts
var Mute = class {
  static getMuteData(player) {
    return TABLES.mutes.get(getId(player));
  }
  constructor(player, length, unit, reason = "No Reason", by = "Smelly Anti Cheat") {
    player.runCommand(`ability @s mute true`);
    const msLength = length ? MS(`${length} ${unit}`) : null;
    const data = {
      player: getId(player),
      date: Date.now(),
      length: msLength,
      expire: msLength ? msLength + Date.now() : null,
      reason,
      by
    };
    TABLES.mutes.set(getId(player), data);
  }
};

// src/modules/commands/mute.ts
new Command({
  name: "mute",
  description: "Mute a player for lengths",
  hasPermission: (player) => ["admin", "moderator"].includes(getRole(player))
}).addOption("player", "player", "Player to mute").addOption("length", "int", "Time ammount of mute", true).addOption("unit", "string", "The unit for the time", true).addOption("reason", "string", "reason for mute", true).executes(
  (ctx, {
    player,
    length,
    unit,
    reason
  }) => {
    new Mute(player, length, unit, reason, ctx.sender.nameTag);
    ctx.reply(
      `\xA7cMuted \xA7f"\xA7a${player.name}\xA7f" \xA7cfor ${length} ${unit} Because: "${reason ?? "No reason Provided"}" \xA7aSuccessfully`
    );
    player.tell(
      `\xA7cYou have been muted by \xA7f"${ctx.sender.name}" \xA7cfor ${length} ${unit} Because: "${reason ?? "No reason Provided"}"`
    );
  }
);

// src/modules/commands/npc.ts
new Command(
  {
    name: "npc",
    description: "Spawns a npc at your coordinates",
    hasPermission: (player) => getRole(player) == "admin"
  },
  (ctx) => {
    NPC_LOCATIONS.push(ctx.sender.location);
    ctx.sender.dimension.spawnEntity("minecraft:npc", ctx.sender.location);
    ctx.reply(`Spawned a verifed npc at your current location`);
  }
);

// src/modules/commands/ping.ts
import { world as world7 } from "mojang-minecraft";
new Command(
  {
    name: "ping",
    description: "Returns the current TPS of the servers ping"
  },
  (ctx) => {
    let pingTick = world7.events.tick.subscribe(({ deltaTime }) => {
      ctx.reply(`Pong! Current TPS: ${1 / deltaTime}`);
      world7.events.tick.unsubscribe(pingTick);
    });
  }
);

// src/modules/commands/region.ts
import { BlockLocation as BlockLocation4 } from "mojang-minecraft";
var command = new Command({
  name: "region",
  description: "Create a Region",
  hasPermission: (player) => getRole(player) == "admin"
});
command.addSubCommand({
  name: "add",
  description: "Adds a new protection region",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("from_x", "int", "The starting x of the region").addOption("from_z", "int", "The starting z of the region").addOption("to_x", "int", "The ending x of the region").addOption("to_z", "int", "The ending z of the region").executes((ctx, { from_x, from_z, to_x, to_z }) => {
  new Region(
    { x: from_x, z: from_z },
    { x: to_x, z: to_z },
    ctx.sender.dimension.id
  );
  ctx.reply(
    `Created Region From ${from_x} -64 ${from_z} ${to_x} 320 ${to_z}`
  );
});
command.addSubCommand(
  {
    name: "remove",
    description: "Removes a region at the players current postion",
    hasPermission: (player) => getRole(player) == "admin"
  },
  (ctx) => {
    const loc = new BlockLocation4(
      ctx.sender.location.x,
      ctx.sender.location.y,
      ctx.sender.location.z
    );
    const r = Region.removeRegionAtBlockLocation(loc, ctx.sender.dimension.id);
    if (r) {
      ctx.reply(`Removed Region at ${loc.x} ${loc.y} ${loc.z}`);
    } else {
      ctx.reply(`Failed to find/remove region at ${loc.x} ${loc.y} ${loc.z}`);
    }
  }
);
command.addSubCommand(
  {
    name: "removeAll",
    description: "Removes all regions",
    hasPermission: (player) => getRole(player) == "admin"
  },
  (ctx) => {
    Region.getAllRegions().forEach((r) => r.delete());
    ctx.reply(`Removed All regions`);
  }
);
command.addSubCommand(
  {
    name: "list",
    description: "Lists all regions and positions",
    hasPermission: (player) => getRole(player) == "admin"
  },
  (ctx) => {
    const regions = Region.getAllRegions();
    for (const region of regions) {
      ctx.reply(
        `Region from ${region.from.x}, ${region.from.z} to ${region.to.x}, ${region.to.z} in dimension ${region.dimensionId}`
      );
    }
    if (regions.length == 0)
      return ctx.reply(`No regions have been made yet`);
  }
);
var permission = command.addSubCommand({
  name: "permission",
  description: "Handels permissions for regions",
  hasPermission: (player) => getRole(player) == "admin"
});
permission.addSubCommand({
  name: "set",
  description: "Sets a certin permission on the region the player is currently in to a value",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption(
  "key",
  ["doorsAndSwitches", "openContainers", "pvp"],
  "The region permission to change"
).addOption("value", "boolean", "If this permission should be on or off").executes((ctx, { key, value }) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation4(
      ctx.sender.location.x,
      ctx.sender.location.y,
      ctx.sender.location.z
    ),
    ctx.sender.dimension.id
  );
  if (!region)
    return ctx.reply(`You are not in a region`);
  region.changePermission(key, value);
  ctx.reply(`Changed permision ${key} to ${value}`);
});
permission.addSubCommand(
  {
    name: "list",
    description: "Lists the permissions for the current region",
    hasPermission: (player) => getRole(player) == "admin"
  },
  (ctx) => {
    const region = Region.blockLocationInRegion(
      new BlockLocation4(
        ctx.sender.location.x,
        ctx.sender.location.y,
        ctx.sender.location.z
      ),
      ctx.sender.dimension.id
    );
    if (!region)
      return ctx.reply(`You are not in a region`);
    ctx.reply(
      `Current region permissions ${JSON.stringify(region.permissions)}`
    );
  }
);
var entityCommands = permission.addSubCommand({
  name: "entities",
  description: "Holds the subCommands for adding or removing allowedEntitys",
  hasPermission: (player) => getRole(player) == "admin"
});
entityCommands.addSubCommand({
  name: "add",
  description: "Adds a entity to the allowed entitys list",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("entity", "string", "the entity id to add").executes((ctx, { entity }) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation4(
      ctx.sender.location.x,
      ctx.sender.location.y,
      ctx.sender.location.z
    ),
    ctx.sender.dimension.id
  );
  if (!region)
    return ctx.reply(`You are not in a region`);
  const currentAllowedEntitys = region.permissions.allowedEntitys;
  currentAllowedEntitys.push(entity);
  region.changePermission("allowedEntitys", currentAllowedEntitys);
  ctx.reply(
    `Added entity ${entity} to the allowed entitys of the region your currently standing in`
  );
});
entityCommands.addSubCommand({
  name: "remove",
  description: "Removes a entity from the allowed entitys in the region",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("entity", "string", "the entity id to add").executes((ctx, { entity }) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation4(
      ctx.sender.location.x,
      ctx.sender.location.y,
      ctx.sender.location.z
    ),
    ctx.sender.dimension.id
  );
  if (!region)
    return ctx.reply(`You are not in a region`);
  let currentAllowedEntitys = region.permissions.allowedEntitys;
  if (!currentAllowedEntitys.includes(entity))
    return ctx.reply(
      `The entity ${entity} is not allowed to enter the region`
    );
  currentAllowedEntitys = currentAllowedEntitys.filter((v) => v != entity);
  region.changePermission("allowedEntitys", currentAllowedEntitys);
  ctx.reply(
    `Removed entity ${entity} to the allowed entitys of the region your currently standing in`
  );
});

// src/modules/commands/role.ts
var main = new Command({
  name: "role",
  description: "Changes role for a player",
  hasPermission: (player) => getRole(player) == "admin"
});
main.addSubCommand({
  name: "set",
  description: "Sets the role for a player",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("playerName", "string", "player to set").addOption(
  "role",
  ["member", "moderator", "admin"],
  "Role to set this player to"
).executes((ctx, { playerName, role }) => {
  setRole(playerName, role);
  ctx.reply(`Changed role of ${playerName} to ${role}`);
});
main.addSubCommand({
  name: "get",
  description: "Gets the role of a player",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("playerName", "string", "player to set").executes((ctx, { playerName }) => {
  ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
});

// src/modules/commands/vanish.ts
import { world as world8 } from "mojang-minecraft";
new Command({
  name: "vanish",
  description: "Toggles Vanish Mode on the sender",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("say", "boolean", "if say you left/joined", true).executes((ctx, { say }) => {
  if (ctx.sender.hasTag(`spectator`)) {
    ctx.sender.runCommand(`gamemode c`);
    ctx.sender.runCommand(`event entity @s removeSpectator`);
    ctx.sender.removeTag(`spectator`);
    if (!say)
      return;
    world8.say({
      rawtext: [
        {
          translate: "multiplayer.player.joined",
          with: [`\xA7e${ctx.sender.name}`]
        }
      ]
    });
  } else {
    ctx.sender.runCommand(`gamemode spectator`);
    ctx.sender.runCommand(`event entity @s addSpectator`);
    ctx.sender.addTag(`spectator`);
    if (!say)
      return;
    world8.say({
      rawtext: [
        {
          translate: "multiplayer.player.left",
          with: [`\xA7e${ctx.sender.name}`]
        }
      ]
    });
  }
});

// src/modules/commands/unban.ts
new Command({
  name: "unban",
  description: "Unban a banned player",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("playerName", "string", "Player to ban").executes((ctx, { playerName }) => {
  const banData = TABLES.bans.values().find((ban) => ban.player == playerName);
  if (!banData)
    return ctx.reply(`${playerName} is not banned`);
  TABLES.bans.delete(banData.key);
  ctx.reply(`\xA7a${playerName}\xA7r has been Unbanned!`);
});

// src/modules/commands/unfreeze.ts
new Command({
  name: "unfreeze",
  description: "Unfreeze a frozen player",
  hasPermission: (player) => getRole(player) == "admin"
}).addOption("playerName", "string", "Player to unfreeze").executes((ctx, { playerName }) => {
  const freeze = TABLES.freezes.values().find((freze) => freze.player == playerName);
  if (!freeze)
    return ctx.reply(`${playerName} is not frozen`);
  TABLES.freezes.delete(freeze.key);
  ctx.reply(`\xA7a${playerName}\xA7r has been UnFrozen!`);
});

// src/modules/commands/unmute.ts
new Command({
  name: "unmute",
  description: "Unmutes a muted player",
  hasPermission: (player) => ["admin", "moderator"].includes(getRole(player))
}).addOption("playerName", "string", "Player to unfreeze").executes((ctx, { playerName }) => {
  const mute = TABLES.mutes.values().find((mute2) => mute2.player == playerName);
  if (!mute)
    return ctx.reply(`${playerName} is not muted!`);
  TABLES.mutes.delete(mute.player);
  try {
    ctx.sender.runCommand(`ability "${playerName}" mute false`);
  } catch (error) {
  }
  ctx.reply(`\xA7a${playerName}\xA7r has been UnMuted!`);
});

// src/config/app.ts
var VERSION = "2.4.0";
var APPEAL_LINK = "https://discord.gg/dMa3A5UYKX";

// src/modules/commands/version.ts
new Command(
  {
    name: "version",
    description: "Get Current Version",
    aliases: ["v"]
  },
  (ctx) => {
    ctx.reply(`Current Rubedo Version: ${VERSION}`);
  }
);

// src/modules/managers/ban.ts
forEachValidPlayer((player) => {
  const uid = getId(player);
  const banData = TABLES.bans.get(uid);
  if (!banData)
    return;
  if (banData.expire && banData.expire < Date.now())
    return TABLES.bans.delete(uid);
  kick(
    player,
    [
      `\xA7cYou have been banned!`,
      `\xA7aReason: \xA7f${banData.reason}`,
      `\xA7fExpiry: \xA7b${banData.expire ? MS(banData.length) : "Forever"}`,
      `\xA7fAppeal at: \xA7b${TABLES.config.get("appealLink") ?? APPEAL_LINK}`
    ],
    () => {
      TABLES.bans.delete(uid);
    }
  );
}, 20);

// src/modules/managers/freeze.ts
import { Location as Location2 } from "mojang-minecraft";
forEachValidPlayer((player) => {
  const freezeData = TABLES.freezes.get(getId(player));
  if (!freezeData)
    return;
  player.teleport(
    new Location2(
      freezeData.location.x,
      freezeData.location.y,
      freezeData.location.z
    ),
    DIMENSIONS[freezeData.location.dimension],
    0,
    0
  );
}, 20);

// src/modules/managers/mute.ts
import { world as world9 } from "mojang-minecraft";
world9.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX))
    return;
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData)
    return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(getId(data.sender));
  data.cancel = true;
  data.sender.tell(text["modules.managers.mute.isMuted"]());
});

// src/modules/managers/region.ts
import { BlockLocation as BlockLocation5, world as world10 } from "mojang-minecraft";
setTickInterval(() => {
  loadRegionDenys();
}, 6e3);
world10.events.beforeItemUseOn.subscribe((data) => {
  if (["moderator", "admin"].includes(getRole(data.source)))
    return;
  const region = Region.blockLocationInRegion(
    data.blockLocation,
    data.source.dimension.id
  );
  if (!region)
    return;
  const block = data.source.dimension.getBlock(data.blockLocation);
  if (DOORS_SWITCHES.includes(block.id) && region.permissions.doorsAndSwitches)
    return;
  if (BLOCK_CONTAINERS2.includes(block.id) && region.permissions.openContainers)
    return;
  data.cancel = true;
});
world10.events.beforeExplosion.subscribe((data) => {
  for (let i = 0; i < data.impactedBlocks.length; i++) {
    const bL = data.impactedBlocks[i];
    let region = Region.blockLocationInRegion(bL, data.dimension.id);
    if (region)
      return data.cancel = true;
  }
});
world10.events.entityCreate.subscribe((data) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation5(
      data.entity.location.x,
      data.entity.location.y,
      data.entity.location.z
    ),
    data.entity.dimension.id
  );
  if (!region)
    return;
  if (region.permissions.allowedEntitys.includes(data.entity.id))
    return;
  data.entity.teleport({ x: 0, y: -64, z: 0 }, data.entity.dimension, 0, 0);
  data.entity.kill();
});
setTickInterval(() => {
  for (const region of Region.getAllRegions()) {
    for (const entity of world10.getDimension(region.dimensionId).getEntities({ excludeTypes: region.permissions.allowedEntitys })) {
      if (!region.entityInRegion(entity))
        continue;
      entity.teleport({ x: 0, y: -64, z: 0 }, entity.dimension, 0, 0);
      entity.kill();
    }
  }
}, 100);
forEachValidPlayer((player) => {
  for (const region of Region.getAllRegions()) {
    if (region.entityInRegion(player)) {
      player.addTag(`inRegion`);
      if (!region.permissions.pvp)
        player.addTag(`region-protected`);
    } else {
      player.removeTag(`inRegion`);
      player.removeTag(`region-protected`);
    }
  }
}, 5);

// src/modules/managers/playerJoin.ts
import { world as world11 } from "mojang-minecraft";
world11.events.playerJoin.subscribe(({ player }) => {
  let e = world11.events.tick.subscribe((data) => {
    try {
      DIMENSIONS.overworld.runCommand(`testfor @a[name="${player.name}"]`);
      world11.events.tick.unsubscribe(e);
      if (Mute.getMuteData(player))
        player.runCommand(`ability @s mute true`);
    } catch (error) {
    }
  });
});

// src/modules/pages/see.ts
import {
  MinecraftItemTypes as MinecraftItemTypes2,
  world as world12
} from "mojang-minecraft";
var FILLABLE_SLOTS = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44
];
var FILLABLE_SLOTS_ENDERCHEST = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  37,
  38,
  39,
  40,
  41,
  42,
  43
];
function ViewPlayersFill(entity, page, extras) {
  const container = entity.getComponent(
    "minecraft:inventory"
  ).container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  for (const [i, player] of [...world12.getPlayers()].entries()) {
    const slot = FILLABLE_SLOTS[i];
    const item = new Item("minecraft:skull", 1, 3, { nameTag: player.name });
    container.setItem(slot, item.setComponents());
    page.slots[slot] = {
      item,
      action: (ctx) => {
        ctx.PageAction("moderation:see_inventory", { name: player.name });
      }
    };
  }
}
function ViewPlayerInventoryFill(entity, page, extras) {
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  const EnderChestItem = new Item("minecraft:ender_chest", 1, 0, {
    nameTag: `\xA7eView \xA7f${extras?.name}\xA7e Ender Chest
\xA7fNote: \xA7cThis will not grab \xA7lANY NBT!\xA7r`
  });
  container.setItem(49, EnderChestItem.setComponents());
  page.slots[49] = {
    item: EnderChestItem,
    action: (ctx) => {
      ctx.PageAction("moderation:see_ender_chest", { name: extras.name });
    }
  };
  const player = [...world12.getPlayers()].find((p) => p.name == extras.name);
  if (!player)
    return;
  const inventory = player.getComponent("inventory").container;
  let used_slots = 0;
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (!item)
      continue;
    const slot = FILLABLE_SLOTS[used_slots];
    used_slots++;
    container.setItem(slot, item);
    page.slots[slot] = {
      item: new Item(item.id, item.amount, item.data, null, item),
      action: (ctx) => {
        if (i < 9) {
          player.runCommand(`replaceitem entity @s slot.hotbar ${i} air`);
        } else {
          player.runCommand(
            `replaceitem entity @s slot.inventory ${i - 9} air`
          );
        }
        ctx.GiveAction();
        page.slots[slot] = {
          item: null,
          action: (ctx2) => {
            inventory.addItem(ctx2.getItemAdded());
          }
        };
      }
    };
  }
}
function ViewPlayerEnderChestFill(entity, page, extras) {
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.setComponents());
  }
  const player = [...world12.getPlayers()].find((p) => p.name == extras?.name);
  if (!player)
    return;
  let used_slots = 0;
  for (const item of Object.values(MinecraftItemTypes2)) {
    try {
      player.runCommand(
        `testfor @s[hasitem={item=${item.id},location=slot.enderchest}]`
      );
      const ChestGuiItem = new Item(item.id, 1, 0, {
        nameTag: "Note: \xA7l\xA7cThis is not the exzact item"
      });
      const slot = FILLABLE_SLOTS_ENDERCHEST[used_slots];
      container.setItem(slot, ChestGuiItem.setComponents());
      page.slots[slot] = {
        item: ChestGuiItem,
        action: (ctx) => {
          ctx.GiveAction();
          page.slots[slot] = null;
        }
      };
      used_slots++;
    } catch (error) {
    }
  }
}
new Page("moderation:see", 54, ViewPlayersFill).setSlots(
  [45, 46, 47, 49, 51, 52, 53],
  new Item("minecraft:stained_glass_pane", 1, 15, {
    nameTag: "\xA7r"
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new Item("minecraft:arrow", 1, 0, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("home");
  }
).setButtonAtSlot(48, CloseGuiButton);
new Page("moderation:see_inventory", 54, ViewPlayerInventoryFill).setSlots(
  [45, 46, 47, 49, 51, 52, 53],
  new Item("minecraft:stained_glass_pane", 1, 15, {
    nameTag: "\xA7r"
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new Item("minecraft:arrow", 1, 0, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setButtonAtSlot(48, CloseGuiButton);
new Page("moderation:see_ender_chest", 54, ViewPlayerEnderChestFill).setSlots(
  [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    17,
    18,
    26,
    27,
    35,
    36,
    44,
    45,
    46,
    47,
    49,
    51,
    52,
    53
  ],
  new Item("minecraft:stained_glass_pane", 1, 15, {
    nameTag: "\xA7r"
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new Item("minecraft:arrow", 1, 0, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setButtonAtSlot(48, CloseGuiButton);

// src/index.ts
var TABLES = {
  config: new Database("config"),
  freezes: new Database("freezes"),
  mutes: new Database("mutes"),
  bans: new Database("bans"),
  regions: new Database("regions"),
  permissions: new Database("permissions")
};
var CONTAINER_LOCATIONS = {};
var NPC_LOCATIONS = [];
var AIR = new ItemStack5(MinecraftItemTypes3.stick, 0);
setTickInterval(() => {
  CONTAINER_LOCATIONS = {};
  for (const player of world13.getPlayers()) {
    const blockLoc = locationToBlockLocation(player.location);
    const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
    const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);
    for (const location of pos1.blocksBetween(pos2)) {
      if (location.y < -64)
        continue;
      const block = player.dimension.getBlock(location);
      if (!BLOCK_CONTAINERS.includes(block.id))
        continue;
      CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(
        block.getComponent("inventory").container
      );
    }
  }
}, 100);
world13.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  runCommand(`tickingarea add 0 0 0 0 0 0 db true`);
  let def = new DynamicPropertiesDefinition();
  def.defineString("name", 30);
  def.defineNumber("index");
  propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    EntityTypes.get(ENTITY_IDENTIFER)
  );
  for (const objective of OBJECTIVES) {
    try {
      world13.scoreboard.addObjective(
        objective.objective,
        objective.displayName ?? objective.objective
      );
    } catch (error) {
    }
  }
});
system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;
  console.warn(`WATCHDOG TRIED TO CRASH = ${data.terminateReason}`);
});
export {
  AIR,
  CONTAINER_LOCATIONS,
  NPC_LOCATIONS,
  TABLES
};
