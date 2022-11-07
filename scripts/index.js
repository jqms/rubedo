// src/index.ts
import {
  ItemStack as ItemStack4,
  MinecraftItemTypes as MinecraftItemTypes5,
  world as world24
} from "@minecraft/server";

// src/lib/Command/index.ts
import { world as world3 } from "@minecraft/server";

// src/config/commands.ts
var PREFIX = "-";

// src/lib/Command/utils.ts
import { Location as Location2 } from "@minecraft/server";

// src/lib/Command/ArgumentTypes.ts
import { world as world2 } from "@minecraft/server";

// src/config/database.ts
import { BlockLocation } from "@minecraft/server";
var MAX_DATABASE_STRING_SIZE = 32e3;
var ENTITY_IDENTIFER = "rubedo:database";
var ENTITY_LOCATION = new BlockLocation(0, -64, 0);

// src/lib/Database/Database.ts
import {
  ItemStack,
  MinecraftItemTypes
} from "@minecraft/server";

// src/lib/Database/utils.ts
function chunkString(str, length2) {
  return str.match(new RegExp(".{1," + length2 + "}", "g"));
}

// src/utils.ts
import {
  world,
  Player,
  BlockLocation as BlockLocation2,
  MinecraftBlockTypes,
  MinecraftDimensionTypes
} from "@minecraft/server";

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
var BLOCK_CONTAINERS = [
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

// src/modules/models/Task.ts
var ChangePlayerRoleTask = class {
  static getTasks() {
    return TABLES.tasks.get("changePlayerRole") ?? [];
  }
  static getPlayersRoleToSet(playerName) {
    const tasks = ChangePlayerRoleTask.getTasks();
    return tasks.find((t) => t.playerName == playerName)?.role;
  }
  constructor(playerName, role) {
    const tasks = ChangePlayerRoleTask.getTasks();
    tasks.push({ playerName, role });
    TABLES.tasks.set("changePlayerRole", tasks);
  }
};

// src/utils.ts
var DIMENSIONS = {
  overworld: world.getDimension(MinecraftDimensionTypes.overworld),
  nether: world.getDimension(MinecraftDimensionTypes.nether),
  theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
  "minecraft:overworld": world.getDimension(MinecraftDimensionTypes.overworld),
  "minecraft:nether": world.getDimension(MinecraftDimensionTypes.nether),
  "minecraft:the_end": world.getDimension(MinecraftDimensionTypes.theEnd)
};
function kick(player, message = [], onFail) {
  if (isServerOwner(player)) {
    console.warn(`[WARNING]: TRIED TO KICK OWNER`);
    player.tell(`You have been tried to kick, but you cant!`);
    return onFail?.();
  }
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
function getRole(player) {
  if (player instanceof Player) {
    return TABLES.roles.get(player.name) ?? "member";
  } else {
    return TABLES.roles.get(player) ?? "member";
  }
}
function setRole(player, value) {
  if (typeof player == "string") {
    TABLES.roles.set(player, value);
    const inGamePlayer = [...world.getPlayers()].find((p) => p.name == player);
    if (inGamePlayer) {
      inGamePlayer.setDynamicProperty("role", value);
    } else {
      new ChangePlayerRoleTask(player, value);
    }
  } else {
    TABLES.roles.set(player.name, value);
    player.setDynamicProperty("role", value);
  }
}
function isServerOwner(player) {
  return world.getDynamicProperty("worldsOwner") == player.id;
}
function isLockedDown() {
  return world.getDynamicProperty("isLockDown") ?? false;
}
function setLockDown(val) {
  world.setDynamicProperty("isLockDown", val);
}
function loadRegionDenys() {
  for (const region of Region.getAllRegions()) {
    const loc1 = new BlockLocation2(region.from.x, -64, region.from.z);
    const loc2 = new BlockLocation2(region.to.x, -64, region.to.z);
    for (const blockLocation of loc1.blocksBetween(loc2)) {
      DIMENSIONS[region.dimensionId].getBlock(blockLocation)?.setType(MinecraftBlockTypes.deny);
    }
  }
}
var CALLBACKS = [];
function forEachValidPlayer(callback, delay = 0) {
  CALLBACKS.push({ callback, delay, lastCall: 0 });
}
world.events.tick.subscribe((tick) => {
  const players = [...world.getPlayers()];
  for (const [i, player] of players.entries()) {
    if (["moderator", "admin"].includes(getRole(player)))
      continue;
    for (const CALLBACK of CALLBACKS) {
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
function durationToMs(duration) {
  const values = duration.split(",");
  console.warn(values.length);
  let ms = 0;
  for (const value of values) {
    const length2 = parseInt(value.match(/\D+|\d+/g)[0]);
    const unit = value.match(/\D+|\d+/g)[1];
    if (unit == "y")
      ms = ms + 317098e-16 * length2;
    if (unit == "w")
      ms = ms + 6048e5 * length2;
    if (unit == "d")
      ms = ms + 864e5 * length2;
    if (unit == "h")
      ms = ms + 36e5 * length2;
    if (unit == "m")
      ms = ms + 6e4 * length2;
    if (unit == "s")
      ms = ms + 1e3 * length2;
    if (unit == "ms")
      ms = ms + length2;
  }
  return ms;
}
function msToTime(duration) {
  return new Date(duration).toString();
}
function locationToBlockLocation(loc) {
  return new BlockLocation2(
    Math.floor(loc.x),
    Math.floor(loc.y),
    Math.floor(loc.z)
  );
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
    let entity = DIMENSIONS.overworld.spawnEntity(
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
    const ens = DIMENSIONS.overworld.getEntitiesAtBlockLocation(ENTITY_LOCATION).filter(
      (e2) => e2.typeId == ENTITY_IDENTIFER && e2.getDynamicProperty("name") == this.name
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
      this.entitys?.forEach((e2) => e2?.triggerEvent("despawn"));
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

// src/lib/Database/tables.ts
var TABLES = {
  config: new Database("config"),
  freezes: new Database("freezes"),
  mutes: new Database("mutes"),
  bans: new Database("bans"),
  regions: new Database("regions"),
  roles: new Database("roles"),
  tasks: new Database("tasks"),
  npcs: new Database("npcs"),
  ids: new Database("ids")
};

// src/lib/Command/ArgumentTypes.ts
function fetch(playerName) {
  return [...world2.getPlayers()].find((plr) => plr.name === playerName);
}
var LiteralArgumentType = class {
  constructor(name = "literal") {
    this.name = name;
    this.typeName = "literal";
    this.name = name;
  }
  matches(value) {
    return {
      success: this.name == value
    };
  }
  fail(value) {
    return `${value} should be ${this.name}!`;
  }
};
var StringArgumentType = class {
  constructor(name = "string") {
    this.name = name;
    this.typeName = "string";
    this.name = name;
  }
  matches(value) {
    return {
      success: value && value != "",
      value
    };
  }
  fail(value) {
    return `Value must be of type string!`;
  }
};
var IntegerArgumentType = class {
  constructor(name = "integer") {
    this.name = name;
    this.typeName = "int";
    this.name = name;
  }
  matches(value) {
    return {
      success: !isNaN(value),
      value: parseInt(value)
    };
  }
  fail(value) {
    return `Value must be vaild number!`;
  }
};
var FloatArgumentType = class {
  constructor(name = "float") {
    this.name = name;
    this.typeName = "float";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^\d+\.\d+$/)?.[0]),
      value: parseInt(value)
    };
  }
  fail(value) {
    return `Value must be vaild float!`;
  }
};
var LocationArgumentType = class {
  constructor(name = "location") {
    this.name = name;
    this.typeName = "location";
    this.name = name;
  }
  matches(value) {
    return {
      success: /^([~^]{0,1}(-\d)?(\d*)?(\.(\d+))?)$/.test(value),
      value
    };
  }
  fail(value) {
    return `Value needs to be a vaild number, value can include: [~,^]`;
  }
};
var BooleanArgumentType = class {
  constructor(name = "boolean") {
    this.name = name;
    this.typeName = "boolean";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^(true|false)$/)?.[0]),
      value: value == "true" ? true : false
    };
  }
  fail(value) {
    return `"${value}" can be either "true" or "false"`;
  }
};
var PlayerArgumentType = class {
  constructor(name = "player") {
    this.name = name;
    this.typeName = "playerName";
    this.name = name;
  }
  matches(value) {
    return {
      success: fetch(value) ? true : false,
      value: fetch(value)
    };
  }
  fail(value) {
    return `player: "${value}", is not in this world`;
  }
};
var TargetArgumentType = class {
  constructor(name = "target") {
    this.name = name;
    this.typeName = "Target";
    this.name = name;
  }
  matches(value) {
    return {
      success: Boolean(value?.match(/^(@.|"[\s\S]+")$/)?.[0]),
      value
    };
  }
  fail(value) {
    return `${value} is not a vaild target`;
  }
};
var ArrayArgumentType = class {
  constructor(name = "array", types) {
    this.name = name;
    this.types = types;
    this.typeName = "string";
    this.name = name;
    this.types = types;
    this.typeName = types.join(" | ").replace(/(.{25})..+/, "$1...");
  }
  matches(value) {
    return {
      success: this.types.includes(value),
      value
    };
  }
  fail(value) {
    return `"${value}" must be one of these values: ${this.types.join(" | ")}`;
  }
};
var DurationArgumentType = class {
  constructor(name) {
    this.name = name;
    this.typeName = "Duration";
  }
  matches(value) {
    return {
      success: /^(\d+[hdysmw],?)+$/.test(value),
      value
    };
  }
  fail(value) {
    return `"${value}" must be a value like "10d" or "3s" the first part is the length second is unit}`;
  }
};
var PlayerNameArgumentType = class {
  constructor(name = "playerName") {
    this.name = name;
    this.typeName = "playerName";
    this.name = name;
  }
  matches(value) {
    const player = TABLES.ids.get(value);
    return {
      success: player ? true : false,
      value
    };
  }
  fail(value) {
    return `player: "${value}" has never played this world before! Tip: if the name has spaces in it use quotes around name!`;
  }
};
var ArgumentTypes = {
  string: StringArgumentType,
  int: IntegerArgumentType,
  float: FloatArgumentType,
  location: LocationArgumentType,
  boolean: BooleanArgumentType,
  player: PlayerArgumentType,
  target: TargetArgumentType,
  array: ArrayArgumentType,
  duration: DurationArgumentType,
  playerName: PlayerNameArgumentType
};

// src/lib/Command/Callback.ts
var CommandCallback = class {
  constructor(data) {
    this.data = data;
    this.sender = data.sender;
  }
  reply(text2) {
    this.sender.tell(text2);
  }
};

// src/lib/Command/utils.ts
function getChatAugments(message, prefix) {
  return message.slice(prefix.length).trim().match(/"[^"]+"|[^\s]+/g).map((e2) => e2.replace(/"(.+)"/, "$1").toString());
}
function commandNotFound(player, command2) {
  player.tell({
    rawtext: [
      {
        text: `\xA7c`
      },
      {
        translate: `commands.generic.unknown`,
        with: [`${command2}`]
      }
    ]
  });
}
function noPerm(player, command2) {
  player.tell({
    rawtext: [
      {
        text: command2.data.invaildPermission ? command2.data.invaildPermission : `\xA7cYou do not have perrmission to use "${command2.data.name}"`
      }
    ]
  });
}
function commandSyntaxFail(player, baseCommand, command2, args, i) {
  player.tell({
    rawtext: [
      {
        text: `\xA7c`
      },
      {
        translate: `commands.generic.syntax`,
        with: [
          `${PREFIX}${baseCommand.data.name} ${args.slice(0, i).join(" ")}`,
          args[i] ?? " ",
          args.slice(i + 1).join(" ")
        ]
      }
    ]
  });
  if (command2.children.length > 1 || !args[i]) {
    const types = command2.children.map(
      (c) => c.type instanceof LiteralArgumentType ? c.type.name : c.type?.typeName
    );
    player.tell(`\xA7c"${args[i] ?? "undefined"}" can be: "${types.join('", "')}`);
  } else {
    player.tell(`\xA7c${command2.children[0]?.type?.fail(args[i])}`);
  }
}
function parseLocationAugs([x, y, z], { location, viewVector }) {
  if (!x || !y || !x)
    return null;
  const locations = [location.x, location.y, location.z];
  const viewVectors = [viewVector.x, viewVector.y, viewVector.z];
  const a = [x, y, z].map((arg) => {
    const r = parseInt(arg.replace(/\D/g, ""));
    return isNaN(r) ? 0 : r;
  });
  const b = [x, y, z].map((arg, index) => {
    return arg.includes("~") ? a[index] + locations[index] : arg.includes("^") ? a[index] + viewVectors[index] : a[index];
  });
  return new Location2(b[0], b[1], b[2]);
}
function sendCallback(cmdArgs, args, event, baseCommand) {
  const lastArg = args[args.length - 1] ?? baseCommand;
  const argsToReturn = [];
  for (const [i, arg] of args.entries()) {
    if (arg.type.name.endsWith("*"))
      continue;
    if (arg.type instanceof LocationArgumentType) {
      argsToReturn.push(
        parseLocationAugs(
          [cmdArgs[i], cmdArgs[i + 1], cmdArgs[i + 2]],
          event.sender
        )
      );
      continue;
    }
    if (arg.type instanceof LiteralArgumentType)
      continue;
    argsToReturn.push(arg.type.matches(cmdArgs[i]).value ?? cmdArgs[i]);
  }
  lastArg.callback(new CommandCallback(event), ...argsToReturn);
}

// src/lib/Command/index.ts
var COMMANDS = [];
world3.events.beforeChat.subscribe((data) => {
  if (!data.message.startsWith(PREFIX))
    return;
  data.cancel = true;
  const args = getChatAugments(data.message, PREFIX);
  const command2 = COMMANDS.find(
    (c) => c.depth == 0 && (c.data.name == args[0] || c.data?.aliases?.includes(args[0]))
  );
  if (!command2)
    return commandNotFound(data.sender, args[0]);
  if (!command2.data?.requires(data.sender))
    return noPerm(data.sender, command2);
  args.shift();
  const verifiedCommands = [];
  const getArg = (start, i) => {
    if (start.children.length > 0) {
      const arg = start.children.find((v) => v.type.matches(args[i]).success);
      if (!arg && !args[i] && start.callback)
        return;
      if (!arg)
        return commandSyntaxFail(data.sender, command2, start, args, i), "fail";
      if (!arg.data?.requires(data.sender))
        return noPerm(data.sender, arg), "fail";
      verifiedCommands.push(arg);
      return getArg(arg, i + 1);
    }
  };
  if (getArg(command2, 0))
    return;
  sendCallback(args, verifiedCommands, data, command2);
});

// src/lib/Chest GUI/index.ts
import { Player as Player6, world as world7 } from "@minecraft/server";

// src/config/chest.ts
var GUI_ITEM = "rubedo:gui";
var ENTITY_INVENTORY = "rubedo:inventory";

// src/lib/Scheduling/Timeout.ts
import { world as world4 } from "@minecraft/server";
var TIMEOUTS = /* @__PURE__ */ new Map();
var Timeout = class {
  constructor(callback, tick, loop = false, id = Date.now()) {
    this.callbackTick = null;
    this.tickDelay = tick;
    this.loop = loop;
    this.callback = callback;
    this.id = id;
    TIMEOUTS.set(id, this);
    this.TickCallBack = world4.events.tick.subscribe(({ currentTick }) => {
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
    world4.events.tick.unsubscribe(this.TickCallBack);
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

// src/lib/Chest GUI/Models/EntityChest.ts
import { world as world6 } from "@minecraft/server";

// src/lib/Events/onSlotChange.ts
var CALLBACKS2 = {};
var MAPPED_INVENTORYS = {};
var PREVIOUS_CHANGE = {};
function getSlotChanges(entity, oldInv, newInv) {
  if (oldInv.length != newInv.length)
    return [];
  const changes = [];
  for (let i = 0; i < newInv.length; i++) {
    if (oldInv[i]?.item?.amount < newInv[i]?.item?.amount || oldInv[i]?.item?.amount > newInv[i]?.item?.amount && oldInv[i]?.item?.amount != 0) {
      const change_data = {
        slot: i,
        uid: newInv[i].uid,
        oldUid: oldInv[i].uid,
        item: newInv[i].item,
        oldItem: oldInv[i].item,
        changeType: "fluctuation"
      };
      changes.push(change_data);
      PREVIOUS_CHANGE[entity.id] = change_data;
      continue;
    }
    if (newInv[i].uid == oldInv[i].uid)
      continue;
    if (oldInv[i]?.item && newInv[i]?.item) {
      const change_data = {
        slot: i,
        uid: newInv[i].uid,
        oldUid: oldInv[i].uid,
        item: newInv[i].item,
        oldItem: oldInv[i].item,
        changeType: "swap"
      };
      changes.push(change_data);
      PREVIOUS_CHANGE[entity.id] = change_data;
    } else if (!newInv[i]?.item) {
      const change_data = {
        slot: i,
        uid: oldInv[i].uid,
        item: oldInv[i].item,
        changeType: "delete"
      };
      changes.push(change_data);
      PREVIOUS_CHANGE[entity.id] = change_data;
    } else if (newInv[i]?.item) {
      if (PREVIOUS_CHANGE[entity.id]?.changeType == "delete" && PREVIOUS_CHANGE[entity.id]?.uid == newInv[i].uid) {
        const change_data = {
          slot: i,
          uid: newInv[i].uid,
          item: newInv[i].item,
          changeType: "move"
        };
        changes.push(change_data);
        PREVIOUS_CHANGE[entity.id] = change_data;
        continue;
      } else {
        const change_data = {
          slot: i,
          uid: newInv[i].uid,
          item: newInv[i].item,
          changeType: "put"
        };
        changes.push(change_data);
        PREVIOUS_CHANGE[entity.id] = change_data;
      }
    }
  }
  return changes;
}
function getItemUid(item) {
  if (!item)
    return "";
  const data = [];
  data.push(item.typeId);
  data.push(item.nameTag);
  data.push(item.data);
  data.push(item.getLore().join(""));
  return data.join("");
}
function mapInventory(container) {
  const inventory = [];
  for (let i = 0; i < container.size; i++) {
    let item = container.getItem(i);
    inventory[i] = {
      uid: getItemUid(item),
      item
    };
  }
  return inventory;
}
setTickInterval(() => {
  for (const callback of Object.values(CALLBACKS2)) {
    for (const entity of DIMENSIONS.overworld.getEntities(callback.entities)) {
      const inventory = mapInventory(
        entity.getComponent("inventory").container
      );
      const changes = getSlotChanges(
        entity,
        MAPPED_INVENTORYS[entity.id] ?? inventory,
        inventory
      );
      MAPPED_INVENTORYS[entity.id] = inventory;
      if (changes.length == 0)
        continue;
      if (entity.hasTag("skipCheck")) {
        entity.removeTag("skipCheck");
        delete PREVIOUS_CHANGE[entity.id];
        continue;
      }
      for (const change of changes) {
        callback.callback(entity, change);
      }
    }
  }
}, 5);
var onEntityInventorySlotChange = class {
  static subscribe(entities, callback) {
    const key = Date.now();
    CALLBACKS2[key] = { callback, entities };
    return key;
  }
  static unsubscribe(key) {
    delete CALLBACKS2[key];
  }
};

// src/modules/models/PlayerLog.ts
import { world as world5 } from "@minecraft/server";
var PlayerLog = class {
  constructor() {
    this.data = /* @__PURE__ */ new Map();
    this.events = {
      playerLeave: world5.events.playerLeave.subscribe(
        (data) => this.data.delete(data.playerName)
      )
    };
  }
  set(player, value) {
    this.data.set(player.name, value);
  }
  get(player) {
    return this.data.get(player.name);
  }
  delete(player) {
    this.data.delete(player.name);
  }
  clear() {
    this.data.clear();
  }
  playerNames() {
    return [...this.data.keys()];
  }
};

// src/lib/Chest GUI/utils.ts
var CHESTGUIS = {};
var PAGES = {};
var CHEST_OPEN = new PlayerLog();
function getHeldItem(player) {
  const inventory = player.getComponent("minecraft:inventory").container;
  return inventory.getItem(player.selectedSlot);
}
async function clearPlayersPointer(player, ItemToClear) {
  try {
    const inventory = player.getComponent("minecraft:inventory").container;
    let itemsToLoad = [];
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (!item)
        continue;
      if (item?.typeId == ItemToClear?.typeId) {
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
      `clear @s ${ItemToClear?.typeId} ${ItemToClear.data} ${ItemToClear.amount}`
    );
    for (const item of itemsToLoad) {
      inventory.setItem(item.slot, item.item);
    }
  } catch (error) {
    [
      ...player.dimension.getEntities({
        type: "minecraft:item",
        location: player.location,
        maxDistance: 2,
        closest: 1
      })
    ].forEach((e2) => e2.kill());
  }
}
function getItemAtSlot(entity, slot) {
  const inventory = entity.getComponent("minecraft:inventory").container;
  return inventory.getItem(slot);
}

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
  CloseAction() {
    this.gui.despawn();
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

// src/lib/Chest GUI/Models/EntityChest.ts
var ChestGUI = class {
  static spawnEntity(player) {
    try {
      return player.dimension.spawnEntity(
        ENTITY_INVENTORY,
        player.headLocation
      );
    } catch (error) {
      return null;
    }
  }
  constructor(player) {
    this.player = player;
    this.entity = ChestGUI.spawnEntity(player);
    if (this.entity) {
      this.hasChestOpen = false;
      this.setPage("home");
    }
    this.tickEvent = world6.events.tick.subscribe(() => {
      if (!this.entity)
        return this.despawn();
      if (CHEST_OPEN.get(this.player)) {
        if (!this.hasChestOpen) {
          this.slotChangeEvent = onEntityInventorySlotChange.subscribe(
            { type: ENTITY_INVENTORY },
            (entity, change) => {
              if (entity.id != this.entity.id)
                return;
              this.onSlotChange(change);
            }
          );
        }
        this.hasChestOpen = true;
      } else {
        try {
          this.entity.teleport(
            this.player.headLocation,
            this.player.dimension,
            0,
            0
          );
        } catch (error) {
          this.despawn();
        }
      }
    });
  }
  setPage(pageId, extras) {
    const c = this.entity.getComponent("inventory").container;
    for (let i = 0; i < c.size; i++) {
      c.setItem(i, AIR);
    }
    if (!Object.keys(PAGES).includes(pageId))
      throw new Error(`pageId ${pageId} does not exist!`);
    const page = PAGES[pageId];
    this.page = page;
    page.fillType(this.entity, page, extras);
    this.entity.nameTag = `size:54`;
  }
  onSlotChange(change) {
    const slot = this.page.slots[change.slot];
    if (!slot) {
      this.entity.getComponent("inventory").container.setItem(change.slot, AIR);
    } else if (change.changeType == "delete") {
      if (slot.item)
        clearPlayersPointer(this.player, change.item);
      if (!slot.item && !getItemAtSlot(this.entity, change.slot))
        return;
      slot.action(new ItemGrabbedCallback(this, slot, change));
    }
  }
  despawn() {
    try {
      this.entity?.triggerEvent("despawn");
    } catch (error) {
    }
    try {
      delete CHESTGUIS[this.player.name];
    } catch (error) {
    }
    if (this.tickEvent)
      world6.events.tick.unsubscribe(this.tickEvent);
    if (this.slotChangeEvent)
      onEntityInventorySlotChange.unsubscribe(this.slotChangeEvent);
  }
};

// src/lib/Chest GUI/Models/PageItem.ts
import {
  ItemStack as ItemStack2
} from "@minecraft/server";
var PageItem = class {
  constructor(itemType, components = {}, itemStack) {
    this.itemType = itemType;
    this.components = components;
    this.setItemStack = itemStack;
  }
  get itemStack() {
    if (this.setItemStack)
      return this.setItemStack;
    const itemStack = new ItemStack2(this.itemType);
    if (this.components) {
      itemStack.amount = this.components?.amount ?? 1;
      itemStack.data = this.components?.data ?? 0;
      itemStack.nameTag = this.components?.nameTag;
      itemStack.setLore(this.components?.loreList ?? []);
      const enchantments = itemStack.getComponent("enchantments").enchantments;
      for (const enchantment of this.components?.enchantments ?? []) {
        enchantments.addEnchantment(enchantment);
      }
      itemStack.getComponent("enchantments").enchantments = enchantments;
    }
    return itemStack;
  }
};

// src/lib/Chest GUI/Models/FillTypes.ts
function DefaultFill(entity, page, extras) {
  const container = entity.getComponent("minecraft:inventory").container;
  for (let i = 0; i < container.size; i++) {
    const slot = page.slots[i];
    if (!slot || !slot.item) {
      container.setItem(i, AIR);
      continue;
    }
    container.setItem(i, slot.item.itemStack);
  }
}

// src/lib/Chest GUI/Models/Page.ts
var Page = class {
  constructor(id, fillType = DefaultFill) {
    if (Object.keys(PAGES).includes(id))
      throw new Error(`Page: ${id}, Already exists!`);
    this.id = id;
    this.fillType = fillType;
    this.slots = [];
    PAGES[id] = this;
  }
  setSlots(slot, item, action) {
    const data = item ? { item, action } : null;
    for (const i of slot) {
      this.slots[i] = data;
    }
    return this;
  }
};

// src/lib/Chest GUI/pages/home.ts
import { MinecraftItemTypes as MinecraftItemTypes2 } from "@minecraft/server";
var HOME_PAGE = new Page("home").setSlots(
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
  new PageItem(MinecraftItemTypes2.stainedGlassPane, {
    data: 15,
    nameTag: "\xA7r"
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [22],
  new PageItem(MinecraftItemTypes2.enderChest, {
    nameTag: "\xA7l\xA7bInventory Viewer"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setSlots(
  [54],
  new PageItem(MinecraftItemTypes2.barrier, { nameTag: "\xA7cClose GUI" }),
  (ctx) => {
    ctx.CloseAction();
  }
);

// src/lib/Chest GUI/index.ts
world7.events.tick.subscribe((data) => {
  for (const player of world7.getPlayers()) {
    if (getHeldItem(player)?.typeId != GUI_ITEM) {
      if (CHESTGUIS[player.name])
        CHESTGUIS[player.name].despawn();
      continue;
    }
    if (Object.keys(CHESTGUIS).includes(player?.name))
      continue;
    CHESTGUIS[player.name] = new ChestGUI(player);
  }
});
world7.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
  if (!(data.entity instanceof Player6))
    return;
  if (data.id == "rubedo:has_container_open") {
    CHEST_OPEN.set(data.entity, true);
  } else if (data.id == "rubedo:dosent_have_container_open") {
    CHEST_OPEN.set(data.entity, false);
  }
});
setTickInterval(() => {
  const vaildIds = Object.values(CHESTGUIS).map((c) => c.entity.id);
  for (const entity of DIMENSIONS.overworld.getEntities({
    type: ENTITY_INVENTORY
  })) {
    if (vaildIds.includes(entity.id))
      continue;
    entity.triggerEvent("despawn");
  }
}, 100);

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
  "modules.commands.ban.reply": (playerName, duration, reason = "") => `\xA7cBanned \xA7f"\xA7a${playerName}\xA7f" \xA7cfor ${length} Because: "${reason ?? "No reason Provided"}" \xA7aSuccessfully`,
  "lockdown.kick.message": () => [
    `\xA7cYou have been kicked!`,
    `\xA7aReason: \xA7fServer is currently under LockDown`,
    `\xA7fServer will be up soon, Try to join later`
  ],
  "commands.ban.list.player": (name, reason, expire) => `- "${name}" Because: ${reason}, Expiry ${expire}`,
  "commands.freeze.list.player": (name, reason) => `- "${name}" Because: ${reason}`,
  "commands.mutes.list.player": (name, reason, expire) => `- "${name}" Because: ${reason}, Expiry ${expire}`
};

// src/lib/Command/Command.ts
var Command = class {
  constructor(data, type, depth = 0, parent) {
    this.data = data;
    this.type = type;
    this.depth = depth;
    this.parent = parent;
    if (!data.requires)
      data.requires = (player) => true;
    this.data = data;
    this.type = type ?? new LiteralArgumentType(this.data.name);
    this.children = [];
    this.depth = depth;
    this.parent = parent;
    this.callback = null;
    COMMANDS.push(this);
  }
  argument(type) {
    const cmd = new Command(
      this.data,
      type,
      this.depth + 1,
      this
    );
    this.children.push(cmd);
    return cmd;
  }
  string(name) {
    return this.argument(new StringArgumentType(name));
  }
  int(name) {
    return this.argument(new IntegerArgumentType(name));
  }
  array(name, types) {
    return this.argument(new ArrayArgumentType(name, types));
  }
  boolean(name) {
    return this.argument(new BooleanArgumentType(name));
  }
  location(name) {
    const cmd = this.argument(new LocationArgumentType(name));
    if (!name.endsWith("*")) {
      const newArg = cmd.location(name + "_y*").location(name + "_z*");
      return newArg;
    }
    return cmd;
  }
  literal(data) {
    const cmd = new Command(
      data,
      new LiteralArgumentType(data.name),
      this.depth + 1,
      this
    );
    this.children.push(cmd);
    return cmd;
  }
  executes(callback) {
    this.callback = callback;
    return this;
  }
};

// src/modules/models/Ban.ts
import { Player as Player7 } from "@minecraft/server";
var Ban = class {
  constructor(player, duration, reason = "No Reason", by = "Smelly Anti Cheat") {
    const id = player instanceof Player7 ? player.id : TABLES.ids.get(player);
    if (!id)
      throw new Error(`"${player}" does not have a saved id!`);
    length = length ? durationToMs(duration) : null;
    const data = {
      key: id,
      playerName: player instanceof Player7 ? player.name : player,
      date: Date.now(),
      length,
      expire: length ? length + Date.now() : null,
      reason,
      by
    };
    TABLES.bans.set(id, data);
  }
};

// src/modules/commands/ban.ts
function ban(ctx, player, duration, reason, by) {
  if (TABLES.bans.get(TABLES.ids.get(player)))
    return ctx.reply(`\xA7c${player} is already banned`);
  new Ban(player, duration, reason, ctx.sender.name);
  ctx.reply(text["modules.commands.ban.reply"](player, duration, reason));
}
var root = new Command({
  name: "ban",
  description: "Manage bans",
  requires: (player) => getRole(player) == "admin"
});
root.literal({
  name: "add",
  description: "Bans a player"
}).argument(new ArgumentTypes.playerName()).executes((ctx, player) => {
  ban(ctx, player, null, null, ctx.sender.name);
}).argument(new ArgumentTypes.duration("duration")).executes((ctx, player, duration) => {
  ban(ctx, player, duration, null, ctx.sender.name);
}).string("reason").executes((ctx, player, duration, reason) => {
  ban(ctx, player, duration, reason, ctx.sender.name);
});
root.literal({
  name: "remove",
  description: "unbans a player"
}).argument(new ArgumentTypes.playerName("playerName")).executes((ctx, playerName) => {
  const banData = TABLES.bans.values().find((ban2) => ban2.playerName == playerName);
  if (!banData)
    return ctx.reply(`${playerName} is not banned`);
  if (TABLES.bans.delete(banData.key)) {
    ctx.reply(`\xA7a${playerName}\xA7r has been Unbanned!`);
  } else {
    ctx.reply(`\xA7cFailed to unban ${playerName}`);
  }
});
root.literal({
  name: "list",
  description: "Lists all bans"
}).executes((ctx) => {
  const bans = TABLES.bans.values();
  if (bans.length == 0)
    return ctx.sender.tell(`\xA7cNo one is banned!`);
  ctx.sender.tell(`\xA72--- Showing Bans (${bans.length}) ---`);
  for (const ban2 of bans) {
    ctx.sender.tell(
      text["commands.ban.list.player"](
        ban2.playerName,
        ban2.reason,
        ban2.expire ? msToTime(ban2.length) : "Forever"
      )
    );
  }
});

// src/modules/commands/database.ts
var dbcm = new Command({
  name: "database",
  description: "Interacts with SA Database",
  aliases: ["db"],
  requires: (player) => getRole(player) == "admin"
});
dbcm.literal({
  name: "get"
}).string("table").string("key").executes((ctx, table, key) => {
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
dbcm.literal({
  name: "set"
}).string("table").string("key").string("value").executes((ctx, table, key, value) => {
  try {
    TABLES[table].set(key, value);
    ctx.reply(`Set Key: "${key}", to value: "${value}" on table: "${table}"`);
  } catch (error) {
    ctx.reply(error + error.stack);
  }
});
dbcm.literal({
  name: "clear"
}).string("table").executes((ctx, table) => {
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
  requires: (player) => getRole(player) == "admin"
}).argument(new ArgumentTypes.player("player")).executes((ctx, player) => {
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
      key: player.id,
      reason,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z,
        dimension: player.dimension.id
      }
    };
    TABLES.freezes.set(player.id, data);
  }
};

// src/modules/commands/freeze.ts
var root2 = new Command({
  name: "freeze",
  description: "Manage Freezes",
  requires: (player) => getRole(player) == "admin"
});
root2.literal({
  name: "add",
  description: "Freezes a player"
}).argument(new ArgumentTypes.player("player")).string("reason").executes((ctx, player, reason) => {
  new Freeze(player, reason);
  ctx.reply(
    `\xA7cFroze \xA7f"\xA7a${player.name}\xA7f" Because: "${reason}" \xA7aSuccessfully`
  );
  ctx.sender.tell(
    `\xA7cYou have been frozen by \xA7f"\xA7a${ctx.sender.name}\xA7f" Because: "${reason}"`
  );
});
root2.literal({
  name: "remove",
  description: "unfreezes a player"
}).argument(new ArgumentTypes.playerName("playerName")).executes((ctx, playerName) => {
  const freeze = TABLES.freezes.values().find((freze) => freze.player == playerName);
  if (!freeze)
    return ctx.reply(`${playerName} is not frozen`);
  TABLES.freezes.delete(freeze.key);
  ctx.reply(`\xA7a${playerName}\xA7r has been UnFrozen!`);
});
root2.literal({
  name: "list",
  description: "Lists all freezes"
}).executes((ctx) => {
  const freezes = TABLES.freezes.values();
  if (freezes.length == 0)
    return ctx.sender.tell(`\xA7cNo one is frozen!`);
  ctx.sender.tell(`\xA72--- Showing Freezes (${freezes.length}) ---`);
  for (const freeze of freezes) {
    ctx.sender.tell(
      text["commands.freeze.list.player"](freeze.player, freeze.reason)
    );
  }
});

// src/modules/commands/help.ts
var CommandNameArgumentType = class {
  constructor(name) {
    this.name = name;
    this.typeName = "CommandName";
  }
  matches(value) {
    return {
      success: Boolean(
        COMMANDS.find((c) => c.depth == 0 && c.data.name == value)
      ),
      value
    };
  }
  fail(value) {
    return `"${value}" is not a vaild command`;
  }
};
function sendCommandType(baseCommand, args, player) {
  player.tell(
    `${PREFIX}${baseCommand.data.name} ${args.map(
      (a) => a.type.typeName == "literal" ? a.data.name : `<${a.type.name}: ${a.type.typeName}>`
    ).join(" ")}`
  );
}
function sendArguments(bc, c, args, p) {
  if (!c.data?.requires(p))
    return;
  if (c.callback) {
    sendCommandType(bc, c.depth == 0 ? args : args.concat(c), p);
  }
  if (c.children.length > 0) {
    for (const child of c.children) {
      sendArguments(bc, child, c.depth == 0 ? args : args.concat(c), p);
    }
  }
}
function sendPageHeader(player, p, maxPages) {
  player.tell(
    `\xA72--- Showing help page ${p} of ${maxPages} (${PREFIX}help <page: int>) ---`
  );
}
function getMaxPages(player) {
  const cmds = COMMANDS.filter((c) => c.depth == 0 && c.data?.requires(player));
  if (cmds.length == 0)
    return 0;
  return Math.ceil(cmds.length / 5);
}
var root3 = new Command({
  name: "help",
  description: "Provides help/list of commands.",
  aliases: ["?", "h"]
}).executes((ctx) => {
  const maxPages = getMaxPages(ctx.sender);
  const cmds = COMMANDS.filter(
    (c) => c.depth == 0 && c.data?.requires(ctx.sender)
  ).slice(1 * 5 - 5, 1 * 5);
  sendPageHeader(ctx.sender, 1, maxPages);
  for (const cmd of cmds) {
    sendArguments(cmd, cmd, [], ctx.sender);
  }
});
root3.int("page").executes((ctx, p) => {
  const maxPages = getMaxPages(ctx.sender);
  if (p > maxPages)
    p = maxPages;
  const cmds = COMMANDS.filter(
    (c) => c.depth == 0 && c.data?.requires(ctx.sender)
  ).slice(p * 5 - 5, p * 5);
  sendPageHeader(ctx.sender, p, maxPages);
  for (const cmd of cmds) {
    sendArguments(cmd, cmd, [], ctx.sender);
  }
});
root3.argument(new CommandNameArgumentType("command")).executes((ctx, command2) => {
  const cmd = COMMANDS.filter(
    (c) => c.depth == 0 && c.data.name == command2
  )[0];
  ctx.sender.tell(
    `\xA7e${cmd.data.name}: ${cmd.data.aliases ? `aliases (${cmd.data.aliases.join(", ")})` : ""}`
  );
  ctx.sender.tell(`\xA7e${cmd.data.description}`);
  ctx.sender.tell(`Usage:`);
  sendArguments(cmd, cmd, [], ctx.sender);
});

// src/modules/commands/lockdown.ts
import { world as world8 } from "@minecraft/server";
new Command({
  name: "lockdown",
  description: "Toggles the servers lockdown, meaning noone can join",
  requires: (player) => getRole(player) == "admin"
}).executes((ctx) => {
  if (isLockedDown()) {
    setLockDown(false);
    ctx.sender.tell(`Unlocked the server!`);
  } else {
    setLockDown(true);
    for (const player of world8.getPlayers()) {
      if (getRole(player) == "admin")
        continue;
      kick(player, text["lockdown.kick.message"]());
    }
    ctx.sender.tell(`Locked down the server, no one can join`);
  }
});

// src/modules/models/Mute.ts
var Mute = class {
  static getMuteData(player) {
    return TABLES.mutes.get(player.name);
  }
  constructor(player, duration, reason = "No Reason", by = "Smelly Anti Cheat") {
    player.runCommand(`ability @s mute true`);
    const msLength = duration ? durationToMs(duration) : null;
    const data = {
      player: player.name,
      date: Date.now(),
      duration: msLength,
      expire: msLength ? msLength + Date.now() : null,
      reason,
      by
    };
    TABLES.mutes.set(player.name, data);
  }
};

// src/modules/commands/mute.ts
var root4 = new Command({
  name: "mute",
  description: "Manage Mutes",
  requires: (player) => ["admin", "moderator"].includes(getRole(player))
});
root4.literal({
  name: "add",
  description: "Mutes a player"
}).argument(new ArgumentTypes.player("player")).argument(new ArgumentTypes.duration("duration")).string("reason").executes((ctx, player, duration, reason) => {
  new Mute(player, duration, reason, ctx.sender.name);
  ctx.reply(
    `\xA7cMuted \xA7f"\xA7a${player.name}\xA7f" \xA7cfor ${duration} Because: "${reason}" \xA7aSuccessfully`
  );
  player.tell(
    `\xA7cYou have been muted by \xA7f"${ctx.sender.name}" \xA7cfor ${duration} Because: "${reason}"`
  );
});
root4.literal({
  name: "remove",
  description: "unmutes a player"
}).argument(new ArgumentTypes.playerName("playerName")).executes((ctx, playerName) => {
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
root4.literal({
  name: "list",
  description: "Lists all feeezes"
}).executes((ctx) => {
  const mutes = TABLES.mutes.values();
  if (mutes.length == 0)
    return ctx.sender.tell(`\xA7cNo one is muted!`);
  ctx.sender.tell(`\xA72--- Showing Mutes (${mutes.length}) ---`);
  for (const mute of mutes) {
    ctx.sender.tell(
      text["commands.mutes.list.player"](
        mute.player,
        mute.reason,
        mute.expire ? msToTime(mute.expire) : "Forever"
      )
    );
  }
});

// src/modules/models/Npc.ts
var Npc = class {
  static isVaild(entity) {
    if (entity.typeId != "minecraft:npc")
      return false;
    if (NPC_LOCATIONS.find((l) => l.equals(entity.location)))
      return true;
    return TABLES.npcs.keys().find((key) => entity.id == key) ? true : false;
  }
  constructor(location, dimension) {
    NPC_LOCATIONS.push(location);
    const entity = dimension.spawnEntity("minecraft:npc", location);
    const data = {
      dimension: entity.dimension.id,
      x: entity.location.x,
      y: entity.location.y,
      z: entity.location.z
    };
    TABLES.npcs.set(entity.id, data);
    clearNpcLocations();
  }
};

// src/modules/commands/npc.ts
new Command({
  name: "npc",
  description: "Spawns a npc at your coordinates",
  requires: (player) => getRole(player) == "admin"
}).executes((ctx) => {
  new Npc(ctx.sender.location, ctx.sender.dimension);
  ctx.reply(`Spawned a verifed npc at your current location`);
});

// src/modules/commands/ping.ts
import { world as world9 } from "@minecraft/server";
new Command({
  name: "ping",
  description: "Returns the current TPS of the servers ping"
}).executes((ctx) => {
  let pingTick = world9.events.tick.subscribe(({ deltaTime }) => {
    ctx.reply(`Pong! Current TPS: ${1 / deltaTime}`);
    world9.events.tick.unsubscribe(pingTick);
  });
});

// src/modules/commands/region.ts
import { BlockLocation as BlockLocation3 } from "@minecraft/server";
var command = new Command({
  name: "region",
  description: "Create a Region",
  requires: (player) => getRole(player) == "admin"
});
command.literal({
  name: "add",
  description: "Adds a new protection region"
}).int("from_x").int("from_z").int("to_x").int("to_z").executes((ctx, from_x, from_z, to_x, to_z) => {
  new Region(
    { x: from_x, z: from_z },
    { x: to_x, z: to_z },
    ctx.sender.dimension.id
  );
  ctx.reply(
    `Created Region From ${from_x} -64 ${from_z} ${to_x} 320 ${to_z}`
  );
});
command.literal({
  name: "remove",
  description: "Removes a region at the players current postion"
}).executes((ctx) => {
  const loc = new BlockLocation3(
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
});
command.literal({
  name: "removeAll",
  description: "Removes all regions"
}).executes((ctx) => {
  Region.getAllRegions().forEach((r) => r.delete());
  ctx.reply(`Removed All regions`);
});
command.literal({
  name: "list",
  description: "Lists all regions and positions"
}).executes((ctx) => {
  const regions = Region.getAllRegions();
  for (const region of regions) {
    ctx.reply(
      `Region from ${region.from.x}, ${region.from.z} to ${region.to.x}, ${region.to.z} in dimension ${region.dimensionId}`
    );
  }
  if (regions.length == 0)
    return ctx.reply(`No regions have been made yet`);
});
var permission = command.literal({
  name: "permission",
  description: "Handels permissions for regions"
});
permission.literal({
  name: "set",
  description: "Sets a certin permission on the region the player is currently in to a value"
}).array("key", ["doorsAndSwitches", "openContainers", "pvp"]).boolean("value").executes((ctx, key, value) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation3(
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
permission.literal({
  name: "list",
  description: "Lists the permissions for the current region"
}).executes((ctx) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation3(
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
});
var entityCommands = permission.literal({
  name: "entities",
  description: "Holds the subCommands for adding or removing allowedEntitys"
});
entityCommands.literal({
  name: "add",
  description: "Adds a entity to the allowed entitys list"
}).string("entity").executes((ctx, entity) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation3(
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
entityCommands.literal({
  name: "remove",
  description: "Removes a entity from the allowed entitys in the region"
}).string("entity").executes((ctx, entity) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation3(
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

// src/types.ts
var ROLES = /* @__PURE__ */ ((ROLES2) => {
  ROLES2[ROLES2["member"] = 0] = "member";
  ROLES2[ROLES2["admin"] = 1] = "admin";
  ROLES2[ROLES2["moderator"] = 2] = "moderator";
  ROLES2[ROLES2["builder"] = 3] = "builder";
  return ROLES2;
})(ROLES || {});

// src/modules/commands/role.ts
var StringIsNumber = (value) => isNaN(Number(value)) === false;
function ToArray(enumme) {
  return Object.keys(enumme).filter(StringIsNumber).map((key) => enumme[key]);
}
var root5 = new Command({
  name: "role",
  description: "Changes the role for a player",
  requires: (player) => getRole(player) == "admin" || isServerOwner(player)
});
root5.literal({
  name: "set",
  description: "Sets the role for a player"
}).argument(new ArgumentTypes.playerName("playerName")).argument(new ArgumentTypes.array("role", ToArray(ROLES))).executes((ctx, playerName, role) => {
  setRole(playerName, role);
  ctx.reply(`Changed role of ${playerName} to ${role}`);
});
root5.literal({
  name: "get",
  description: "Gets the role of a player"
}).argument(new ArgumentTypes.playerName("playerName")).executes((ctx, playerName) => {
  ctx.reply(`${playerName} has role: ${getRole(playerName)}`);
});

// src/lib/Form/Models/ActionForm.ts
import { ActionFormData } from "@minecraft/server-ui";

// src/config/form.ts
var TIMEOUT_THRESHOLD = 200;

// src/lib/Form/Models/ActionForm.ts
var ActionForm = class {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.form = new ActionFormData();
    if (title)
      this.form.title(title);
    if (body)
      this.form.body(body);
    this.buttons = [];
    this.triedToShow = 0;
  }
  addButton(text2, iconPath = null, callback) {
    this.buttons.push({
      text: text2,
      iconPath,
      callback
    });
    this.form.button(text2, iconPath);
    return this;
  }
  show(player) {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == "userBusy") {
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.tell(
              `\xA7cForm Timeout: tried to show form, but you were busy (close chat after running command)`
            );
          this.triedToShow++;
          this.show(player);
        }
        return;
      }
      this.buttons[response.selection].callback?.();
    });
  }
};

// src/modules/forms/settings.ts
import { ItemTypes, MinecraftBlockTypes as MinecraftBlockTypes2 } from "@minecraft/server";

// src/config/app.ts
var VERSION = "2.5.0-beta";
var APPEAL_LINK = "https://discord.gg/dMa3A5UYKX";

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

// src/config/moderation.ts
var BANNED_ITEMS = [
  "minecraft:beehive",
  "minecraft:bee_nest",
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
var BLOCK_CONTAINERS2 = [
  "minecraft:chest",
  "minecraft:trapped_chest"
];
var CHECK_SIZE = { x: 7, y: 7, z: 7 };

// src/lib/Form/Models/ModelForm.ts
import { ModalFormData } from "@minecraft/server-ui";

// src/lib/Form/Models/MessageForm.ts
import { MessageFormData } from "@minecraft/server-ui";
var MessageForm = class {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.form = new MessageFormData();
    if (title)
      this.form.title(title);
    if (body)
      this.form.body(body);
    this.triedToShow = 0;
  }
  setButton1(text2, callback) {
    this.button1 = { text: text2, callback };
    this.form.button1(text2);
    return this;
  }
  setButton2(text2, callback) {
    this.button2 = { text: text2, callback };
    this.form.button2(text2);
    return this;
  }
  show(player) {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == "userBusy") {
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.tell(
              `\xA7cForm Timeout: tried to show form, but you were busy (close chat after running command)`
            );
          this.triedToShow++;
          this.show(player);
        }
        return;
      }
      if (response.selection == 1)
        this.button1?.callback?.();
      if (response.selection == 0)
        this.button2?.callback?.();
    });
  }
};

// src/lib/Form/Models/FormCallback.ts
var FormCallback = class {
  constructor(form, player, callback) {
    this.form = form;
    this.player = player;
    this.callback = callback;
  }
  error(message) {
    new MessageForm("Error", message).setButton1("Return to form", () => {
      this.form.show(this.player, this.callback);
    }).setButton2("Cancel", null).show(this.player);
  }
};

// src/lib/Form/Models/ModelForm.ts
var ModalForm = class {
  constructor(title) {
    this.title = title;
    this.form = new ModalFormData();
    if (title)
      this.form.title(title);
    this.args = [];
    this.triedToShow = 0;
  }
  addDropdown(label, options, defaultValueIndex) {
    this.args.push({ type: "dropdown", options });
    this.form.dropdown(label, options, defaultValueIndex);
    return this;
  }
  addSlider(label, minimumValue, maximumValue, valueStep, defaultValue) {
    this.args.push({ type: "slider" });
    this.form.slider(
      label,
      minimumValue,
      maximumValue,
      valueStep,
      defaultValue
    );
    return this;
  }
  addToggle(label, defaultValue) {
    this.args.push({ type: "toggle" });
    this.form.toggle(label, defaultValue);
    return this;
  }
  addTextField(label, placeholderText, defaultValue) {
    this.args.push({ type: "textField" });
    this.form.textField(label, placeholderText, defaultValue);
    return this;
  }
  show(player, callback) {
    this.form.show(player).then((response) => {
      if (response.canceled) {
        if (response.cancelationReason == "userBusy") {
          if (this.triedToShow > TIMEOUT_THRESHOLD)
            return player.tell(
              `\xA7cForm Timeout: tried to show form, but you were busy (close chat after running command)`
            );
          this.triedToShow++;
          this.show(player, callback);
        }
        return;
      }
      callback(
        new FormCallback(this, player, callback),
        ...response.formValues.map(
          (v, i) => this.args[i].type == "dropdown" ? this.args[i].options[v] : v
        )
      );
    });
  }
};

// src/modules/forms/settings.ts
function showPage1(player) {
  new ModalForm("Manage Banned Items").addDropdown("Add/Remove Item", ["add", "remove"], 0).addTextField("Item Id", "minecraft:string").show(player, (ctx, method, id) => {
    if (!ItemTypes.get(id)?.id)
      return ctx.error(
        `\xA7c"${id}" is not a vaild item id, note: this item must be either a item in a behavior pack or a default minecraft item`
      );
    if (method == "add") {
      let items = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
      if (items.includes(id))
        return ctx.error(`\xA7cItem "${id}" is already banned`);
      items.push(id);
      TABLES.config.set("banned_items", items);
      player.tell(`Banned the item "${id}"`);
    } else {
      let items = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
      if (!items.includes(id))
        return ctx.error(`\xA7cItem: "${id}" is not banned`);
      items = items.filter((p) => p != id);
      TABLES.config.set("banned_items", items);
      player.tell(`Removed Banned item "${id}"`);
    }
  });
}
function showPage2(player) {
  new ModalForm("Manage Banned Blocks").addDropdown("Add/Remove Block", ["add", "remove"], 0).addTextField("Block Id", "minecraft:barrier").show(player, (ctx, method, id) => {
    if (!MinecraftBlockTypes2.get(id)?.id)
      return ctx.error(
        `\xA7c"${id}" is not a vaild block id, note: this item must be either a block in a behavior pack or a default minecraft block`
      );
    if (method == "add") {
      let blocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
      if (blocks.includes(id))
        return ctx.error(`\xA7cBlock "${id}" is already banned`);
      blocks.push(id);
      TABLES.config.set("banned_blocks", id);
      player.tell(`Banned the block "${id}"`);
    } else {
      let blocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
      if (!blocks.includes(id))
        return ctx.error(`block: "${id}" is not banned`);
      blocks = blocks.filter((p) => p != id);
      TABLES.config.set("banned_blocks", id);
      player.tell(`Removed Banned block "${id}"`);
    }
  });
}
function showPage3(player) {
  new ModalForm("Manage Enchantment Levels").addDropdown("Enchantment to change", Object.keys(ENCHANTMENTS), 0).addTextField("Level (number)", "5").show(player, (ctx, enchantment, levelstring) => {
    if (isNaN(levelstring))
      return ctx.error(
        `\xA7c"${levelstring}" is not a number, please enter a value like, "3", "9", etc.`
      );
    const level = parseInt(levelstring);
    let enchants = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    enchants[enchantment] = level;
    TABLES.config.set("enchantments", enchants);
    player.tell(`Set max level for ${enchantment} to ${level}`);
  });
}
function showPage4(player) {
  new ModalForm("Manage Appeal Link").addTextField("Appeal Link", APPEAL_LINK).show(player, (ctx, link) => {
    TABLES.config.set("appealLink", link);
    player.tell(`Changed the servers appeal link to ${link}`);
  });
}

// src/modules/forms/automod.ts
function showPage12(player) {
  new ActionForm("Rubedo Settings").addButton("Anti Spam", "textures/ui/permissions_op_crown.png", () => {
    showPage22(player);
  }).addButton("Cbe", "textures/blocks/sculk_shrieker_top.png", () => {
    showPage32(player);
  }).addButton("Gamemode", "textures/blocks/barrier.png", () => {
    showPage42(player);
  }).addButton("Nuker", "textures/ui/Feedback.png", () => {
    showPage5(player);
  }).show(player);
}
function showPage22(player) {
  const spam_config = TABLES.config.get("spam_config") ?? {
    repeatedMessages: true,
    zalgo: true,
    violationCount: 0,
    permMutePlayer: false
  };
  new ModalForm("Manage Spam Protection").addToggle("Ban Repeated Messages", spam_config.repeatedMessages).addToggle("Ban Zalgo", spam_config.zalgo).addSlider(
    "Violation Count before ban (if ban is false this does nothing)",
    0,
    20,
    1,
    spam_config.violationCount
  ).addToggle("Perm Mute Player", spam_config.permMutePlayer).show(
    player,
    (ctx, repeatedMessages, zalgo, violationCount, permMutePlayer) => {
      TABLES.config.set("spam_config", {
        repeatedMessages,
        zalgo,
        violationCount,
        permMutePlayer
      });
      player.tell(`Updated Spam Protection settings!`);
    }
  );
}
function showPage32(player) {
  const cbe_data = TABLES.config.get("cbe_config") ?? {
    clearItem: true,
    violationCount: 0,
    banPlayer: false
  };
  new ModalForm("Manage CBE Protection").addToggle("Clear Item", cbe_data.clearItem).addSlider(
    "Violation Count before ban (if ban is false this does nothing)",
    0,
    20,
    1,
    cbe_data.violationCount
  ).addToggle("Ban Player", cbe_data.banPlayer).show(player, (ctx, clearItem, violationCount, banPlayer) => {
    TABLES.config.set("cbe_config", {
      clearItem,
      violationCount,
      banPlayer
    });
    player.tell(`Updated CBE Protection settings!`);
  });
}
function showPage42(player) {
  const gamemode_data = TABLES.config.get("gamemode_config") ?? {
    setToSurvival: true,
    clearPlayer: true,
    violationCount: 0,
    banPlayer: false
  };
  new ModalForm("Manage Gamemode Protection").addToggle("Set to survival", gamemode_data.setToSurvival).addToggle(
    "Clear Player (Once this players gamemode has been switched back to survival should it clear the inventory?)",
    gamemode_data.clearPlayer
  ).addSlider(
    "Violation Count before ban (if ban is false this does nothing)",
    0,
    20,
    1,
    gamemode_data.violationCount
  ).addToggle("Ban Player", gamemode_data.banPlayer).show(
    player,
    (ctx, setToSurvival, clearPlayer, violationCount, banPlayer) => {
      TABLES.config.set("gamemode_config", {
        setToSurvival,
        clearPlayer,
        violationCount,
        banPlayer
      });
      player.tell(`Updated Gamemode Protection settings!`);
    }
  );
}
function showPage5(player) {
  const nuker_data = TABLES.config.get("nuker_data") ?? {
    violationCount: 0,
    banPlayer: false
  };
  new ModalForm("Manage Gamemode Protection").addSlider(
    "Violation Count before ban (if ban is false this does nothing)",
    0,
    20,
    1,
    nuker_data.violationCount
  ).addToggle("Ban Player", nuker_data.banPlayer).show(player, (ctx, violationCount, banPlayer) => {
    TABLES.config.set("nuker_data", {
      violationCount,
      banPlayer
    });
    player.tell(`Updated Nuker Protection settings!`);
  });
}

// src/modules/forms/home.ts
function showHome(player) {
  new ActionForm("Rubedo Settings").addButton("Auto Mod", "textures/ui/permissions_op_crown.png", () => {
    showPage12(player);
  }).addButton("Banned items", "textures/blocks/sculk_shrieker_top.png", () => {
    showPage1(player);
  }).addButton("Banned blocks", "textures/blocks/barrier.png", () => {
    showPage2(player);
  }).addButton("Enchantments", "textures/items/book_enchanted.png", () => {
    showPage3(player);
  }).addButton("Appeal Link", "textures/ui/Feedback.png", () => {
    showPage4(player);
  }).show(player);
}

// src/modules/commands/settings.ts
new Command({
  name: "settings",
  description: "Opens up the settings menu for the player",
  requires: (player) => ["admin", "moderator"].includes(getRole(player))
}).executes((ctx) => {
  showHome(ctx.sender);
  ctx.sender.tell(`\xA7aForm request sent, close chat to continue!`);
});

// src/modules/commands/vanish.ts
import { world as world10 } from "@minecraft/server";
new Command({
  name: "vanish",
  description: "Toggles Vanish Mode on the sender",
  requires: (player) => getRole(player) == "admin"
}).boolean("say").executes((ctx, say) => {
  if (ctx.sender.hasTag(`spectator`)) {
    ctx.sender.runCommand(`gamemode c`);
    ctx.sender.runCommand(`event entity @s removeSpectator`);
    ctx.sender.removeTag(`spectator`);
    if (!say)
      return;
    world10.say({
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
    world10.say({
      rawtext: [
        {
          translate: "multiplayer.player.left",
          with: [`\xA7e${ctx.sender.name}`]
        }
      ]
    });
  }
});

// src/modules/commands/version.ts
new Command({
  name: "version",
  description: "Get Current Version",
  aliases: ["v"]
}).executes((ctx) => {
  ctx.reply(`Current Rubedo Version: ${VERSION}`);
});

// src/modules/managers/ban.ts
forEachValidPlayer((player) => {
  try {
    const banData = TABLES.bans.get(player.id);
    if (!banData)
      return;
    console.warn(player.name);
    if (banData.expire && banData.expire < Date.now())
      return TABLES.bans.delete(player.id);
    kick(
      player,
      [
        `\xA7cYou have been banned!`,
        `\xA7aReason: \xA7f${banData.reason}`,
        `\xA7fExpiry: \xA7b${banData.expire ? msToTime(banData.length) : "Forever"}`,
        `\xA7fAppeal at: \xA7b${TABLES.config.get("appealLink") ?? APPEAL_LINK}`
      ],
      () => {
        console.warn(new Error("Failed to kick player"));
        TABLES.bans.delete(player.id);
      }
    );
  } catch (error) {
    console.warn(error + error.stack);
  }
}, 20);

// src/modules/managers/freeze.ts
import { Location as Location3 } from "@minecraft/server";
forEachValidPlayer((player) => {
  const freezeData = TABLES.freezes.get(player.id);
  if (!freezeData)
    return;
  player.teleport(
    new Location3(
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
import { world as world11 } from "@minecraft/server";
world11.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX))
    return;
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData)
    return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(data.sender.name);
  data.cancel = true;
  data.sender.tell(text["modules.managers.mute.isMuted"]());
});

// src/modules/managers/region.ts
import { BlockLocation as BlockLocation4, world as world12 } from "@minecraft/server";
setTickInterval(() => {
  loadRegionDenys();
}, 6e3);
world12.events.beforeItemUseOn.subscribe((data) => {
  if (["moderator", "admin"].includes(getRole(data.source)))
    return;
  const region = Region.blockLocationInRegion(
    data.blockLocation,
    data.source.dimension.id
  );
  if (!region)
    return;
  const block = data.source.dimension.getBlock(data.blockLocation);
  if (DOORS_SWITCHES.includes(block.typeId) && region.permissions.doorsAndSwitches)
    return;
  if (BLOCK_CONTAINERS.includes(block.typeId) && region.permissions.openContainers)
    return;
  data.cancel = true;
});
world12.events.beforeExplosion.subscribe((data) => {
  for (let i = 0; i < data.impactedBlocks.length; i++) {
    const bL = data.impactedBlocks[i];
    let region = Region.blockLocationInRegion(bL, data.dimension.id);
    if (region)
      return data.cancel = true;
  }
});
world12.events.entityCreate.subscribe((data) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation4(
      data.entity.location.x,
      data.entity.location.y,
      data.entity.location.z
    ),
    data.entity.dimension.id
  );
  if (!region)
    return;
  if (region.permissions.allowedEntitys.includes(data.entity.typeId))
    return;
  data.entity.teleport({ x: 0, y: -64, z: 0 }, data.entity.dimension, 0, 0);
  data.entity.kill();
});
setTickInterval(() => {
  for (const region of Region.getAllRegions()) {
    for (const entity of DIMENSIONS[region.dimensionId].getEntities({ excludeTypes: region.permissions.allowedEntitys })) {
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

// src/modules/events/playerJoin.ts
import { world as world13 } from "@minecraft/server";
world13.events.playerJoin.subscribe(({ player }) => {
  if (isLockedDown() && getRole(player) != "admin")
    return kick(player, text["lockdown.kick.message"]());
  let e2 = world13.events.tick.subscribe((data) => {
    try {
      DIMENSIONS.overworld.runCommand(`testfor @a[name="${player.name}"]`);
      world13.events.tick.unsubscribe(e2);
      if (Mute.getMuteData(player))
        player.runCommand(`ability @s mute true`);
      if (!player.hasTag("old")) {
        TABLES.ids.set(player.name, player.id);
      } else {
        player.addTag("old");
      }
      const roleToSet = ChangePlayerRoleTask.getPlayersRoleToSet(player.name);
      if (roleToSet)
        setRole(player, roleToSet);
    } catch (error) {
    }
  });
});

// src/modules/pages/see.ts
import {
  Items,
  MinecraftItemTypes as MinecraftItemTypes3,
  world as world14
} from "@minecraft/server";
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
    container.setItem(i, slot.item.itemStack);
  }
  for (const [i, player] of [...world14.getPlayers()].entries()) {
    const slot = FILLABLE_SLOTS[i];
    const item = new PageItem(MinecraftItemTypes3.skull, {
      nameTag: player.name,
      data: 3
    });
    container.setItem(slot, item.itemStack);
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
    container.setItem(i, slot.item.itemStack);
  }
  const EnderChestItem = new PageItem(MinecraftItemTypes3.enderChest, {
    nameTag: `\xA7eView \xA7f${extras?.name}\xA7e Ender Chest
\xA7fNote: \xA7cThis will not grab \xA7lANY NBT!\xA7r`
  });
  container.setItem(49, EnderChestItem.itemStack);
  page.slots[49] = {
    item: EnderChestItem,
    action: (ctx) => {
      ctx.PageAction("moderation:see_ender_chest", { name: extras.name });
    }
  };
  const player = [...world14.getPlayers()].find((p) => p.name == extras.name);
  if (!player) {
    const gui = Object.values(CHESTGUIS).find((e2) => e2.entity.id == entity.id);
    gui.despawn();
    player.tell(`"${extras.name}" Could not be found, Gui Crashed`);
  }
  const inventory = player.getComponent("inventory").container;
  let used_slots = 0;
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    const slot = FILLABLE_SLOTS[used_slots];
    used_slots++;
    if (!item) {
      container.setItem(slot, AIR);
      continue;
    }
    container.setItem(slot, item);
    page.slots[slot] = {
      item: new PageItem(
        Items.get(item.typeId),
        { amount: item.amount, data: item.data },
        item
      ),
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
    container.setItem(i, slot.item.itemStack);
  }
  const player = [...world14.getPlayers()].find((p) => p.name == extras?.name);
  if (!player)
    return;
  let used_slots = 0;
  for (const item of Object.values(MinecraftItemTypes3)) {
    try {
      player.runCommand(
        `testfor @s[hasitem={item=${item.id},location=slot.enderchest}]`
      );
      const ChestGuiItem = new PageItem(item.id, {
        nameTag: "Note: \xA7l\xA7cThis is not the exzact item"
      });
      const slot = FILLABLE_SLOTS_ENDERCHEST[used_slots];
      container.setItem(slot, ChestGuiItem.itemStack);
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
new Page("moderation:see", ViewPlayersFill).setSlots(
  [45, 46, 47, 49, 51, 52, 53],
  new PageItem(MinecraftItemTypes3.stainedGlassPane, {
    nameTag: "\xA7r",
    data: 15
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new PageItem(MinecraftItemTypes3.arrow, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("home");
  }
).setSlots(
  [48],
  new PageItem(MinecraftItemTypes3.barrier, { nameTag: "\xA7cClose GUI" }),
  (ctx) => {
    ctx.CloseAction();
  }
);
new Page("moderation:see_inventory", ViewPlayerInventoryFill).setSlots(
  [45, 46, 47, 49, 51, 52, 53],
  new PageItem(MinecraftItemTypes3.stainedGlassPane, {
    nameTag: "\xA7r",
    data: 15
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new PageItem(MinecraftItemTypes3.arrow, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setSlots(
  [48],
  new PageItem(MinecraftItemTypes3.barrier, { nameTag: "\xA7cClose GUI" }),
  (ctx) => {
    ctx.CloseAction();
  }
);
new Page("moderation:see_ender_chest", ViewPlayerEnderChestFill).setSlots(
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
  new PageItem(MinecraftItemTypes3.stainedGlassPane, {
    nameTag: "\xA7r",
    data: 15
  }),
  (ctx) => {
    ctx.SetAction();
  }
).setSlots(
  [50],
  new PageItem(MinecraftItemTypes3.arrow, {
    nameTag: "\xA7fBack"
  }),
  (ctx) => {
    ctx.PageAction("moderation:see");
  }
).setSlots(
  [48],
  new PageItem(MinecraftItemTypes3.barrier, { nameTag: "\xA7cClose GUI" }),
  (ctx) => {
    ctx.CloseAction();
  }
);

// src/modules/protections/cbe.ts
import {
  ItemStack as ItemStack3,
  MinecraftBlockTypes as MinecraftBlockTypes3,
  MinecraftItemTypes as MinecraftItemTypes4,
  world as world15
} from "@minecraft/server";
var AIR2 = new ItemStack3(MinecraftItemTypes4.stick, 0);
var CBE_ENTITIES = ["minecraft:command_block_minecart"];
var ViolationCount = new PlayerLog();
forEachValidPlayer((player) => {
  const cbe_data = TABLES.config.get("cbe_config") ?? {
    clearItem: true,
    violationCount: 0,
    banPlayer: false
  };
  const inventory = player.getComponent("inventory").container;
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (!item)
      continue;
    const clear = () => {
      console.warn(`[Protection: CBE]: ${player.name} Has a CBE item!`);
      if (cbe_data.clearItem)
        player.getComponent("inventory").container.setItem(i, AIR2);
      const count = (ViolationCount.get(player) ?? 0) + 1;
      ViolationCount.set(player, count);
      if (cbe_data.banPlayer && count >= cbe_data.violationCount)
        new Ban(player, null, null, "Cbe Detection");
    };
    let bannedItems = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (bannedItems.includes(item.typeId))
      return clear();
    const enchs = item.getComponent("enchantments").enchantments;
    const MAX_ENCHS = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    const ids = [];
    for (const ench of enchs) {
      let maxLevel = MAX_ENCHS[ench.type.id] ?? ench.type.maxLevel;
      if (enchs.slot == 0 && !enchs.canAddEnchantment(ench))
        return clear();
      if (ench.level > maxLevel)
        return clear();
      if (ids.includes(ench.type.id))
        return clear();
      ids.push(ench.type.id);
    }
  }
});
world15.events.beforeDataDrivenEntityTriggerEvent.subscribe(({ id, entity }) => {
  if (id != "minecraft:entity_spawned")
    return;
  const kill = () => {
    try {
      entity.triggerEvent("despawn");
      entity.kill();
    } catch (error) {
      entity.kill();
    }
  };
  if (CBE_ENTITIES.includes(entity.typeId))
    return kill();
  if (entity.typeId == "minecraft:npc" && !Npc.isVaild(entity))
    return kill();
});
world15.events.blockPlace.subscribe(({ block, player }) => {
  if (["moderator", "admin"].includes(getRole(player)))
    return;
  const bannedBlocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
  if (bannedBlocks.includes(block.typeId))
    block.setType(MinecraftBlockTypes3.air);
});

// src/modules/protections/crasher.ts
var DISTANCE = 32e4;
forEachValidPlayer((player) => {
  if (Math.abs(player.location.x) > DISTANCE || Math.abs(player.location.y) > DISTANCE || Math.abs(player.location.z) > DISTANCE) {
    new Ban(player, null, null, "Hacking: Crasher");
  }
});

// src/modules/models/PreviousLocation.ts
import {
  world as world16
} from "@minecraft/server";
var PreviousLocation = class {
  constructor(player, tick, storage) {
    this.player = player;
    this.location = player.location;
    this.dimension = player.dimension;
    this.rotation = player.rotation;
    this.tick = tick;
    this.storage = storage;
    this.events = {
      playerLeave: world16.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName == this.player.name)
          this.expire();
      })
    };
    this.storage.set(player, this);
  }
  back() {
    this.player.teleport(
      this.location,
      this.dimension,
      this.rotation.x,
      this.rotation.y
    );
  }
  update() {
    this.tick = CURRENT_TICK;
    this.location = this.player.location;
    this.dimension = this.player.dimension;
    this.rotation = this.player.rotation;
  }
  expire() {
    this.storage.delete(this.player);
    for (const key in this.events) {
      world16.events[key].unsubscribe(this.events[key]);
    }
  }
};

// src/modules/protections/fly.ts
var log = new PlayerLog();
var FLYING_VELOCITY = 0.9;
var FLY_TIME = 20;
var DAMAGE = true;
var TAGS = ["gliding", "riding", "levitating", "swimming"];
function getHeldItem2(player) {
  const inventory = player.getComponent(
    "minecraft:inventory"
  ).container;
  return inventory.getItem(player.selectedSlot);
}
forEachValidPlayer((player, { currentTick }) => {
  if (player.getTags().some((tag) => TAGS.includes(tag)))
    return;
  const get = () => log.get(player) ?? new PreviousLocation(player, currentTick, log);
  const velocity = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
  if (player.hasTag("on_ground"))
    return get().update();
  if (velocity < FLYING_VELOCITY)
    return;
  if (getHeldItem2(player)?.typeId == "minecraft:trident")
    return;
  if (currentTick - get().tick < FLY_TIME)
    return;
  get().back();
  if (DAMAGE) {
    try {
      player.runCommand(`damage @s 4 fly_into_wall`);
    } catch (error) {
    }
  }
}, 20);

// src/modules/protections/gamemode.ts
import { GameMode, world as world17 } from "@minecraft/server";
var ILLEGLE_GAMEMODE = GameMode.creative;
var ViolationCount2 = new PlayerLog();
setTickInterval(() => {
  const gamemode_config = TABLES.config.get("gamemode_config") ?? {
    setToSurvival: true,
    clearPlayer: true,
    violationCount: 0,
    banPlayer: false
  };
  for (const player of world17.getPlayers({ gameMode: ILLEGLE_GAMEMODE })) {
    if (["moderator", "admin", "builder"].includes(getRole(player)))
      continue;
    try {
      if (gamemode_config.setToSurvival)
        player.runCommand(`gamemode s`);
      if (gamemode_config.clearPlayer)
        player.runCommand(`clear @s`);
    } catch (error) {
    }
    const count = (ViolationCount2.get(player) ?? 0) + 1;
    ViolationCount2.set(player, count);
    if (gamemode_config.banPlayer && count >= gamemode_config.violationCount)
      new Ban(player, null, null, "Invaild Gamemode");
  }
}, 20);

// src/modules/protections/nameSpoof.ts
import { world as world18 } from "@minecraft/server";
var TOOLBOX_NAME = `\xA7c\xA7k\xA7m\xA7A\xA7r\xA7cToolbox Gamer\xA7k\xA7mA\xA7r`;
world18.events.playerJoin.subscribe(({ player }) => {
  const fail = () => kick(player, [
    `\xA7cYou have been kicked!`,
    `\xA7aReason: \xA7f'${player.name}' is Detected for nameSpoof`,
    `\xA7fThis Server requires you to have a valid gamertag!`
  ]);
  if (player.name == TOOLBOX_NAME)
    return fail();
  if ([...world18.getPlayers()].filter((p) => p.name == player.name).length > 1)
    return fail();
  if ((TABLES.ids.get(player.name) ?? player.id) != player.id)
    return fail();
});

// src/modules/protections/nuker.ts
import { world as world20, Location as Location5 } from "@minecraft/server";

// src/modules/managers/containers.ts
import { world as world19 } from "@minecraft/server";

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

// src/modules/managers/containers.ts
var CONTAINER_LOCATIONS = {};
setTickInterval(() => {
  CONTAINER_LOCATIONS = {};
  for (const player of world19.getPlayers()) {
    const blockLoc = locationToBlockLocation(player.location);
    const pos1 = blockLoc.offset(CHECK_SIZE.x, CHECK_SIZE.y, CHECK_SIZE.z);
    const pos2 = blockLoc.offset(-CHECK_SIZE.x, -CHECK_SIZE.y, -CHECK_SIZE.z);
    for (const location of pos1.blocksBetween(pos2)) {
      if (location.y < -64)
        continue;
      const block = player.dimension.getBlock(location);
      if (!BLOCK_CONTAINERS2.includes(block.typeId))
        continue;
      CONTAINER_LOCATIONS[JSON.stringify(location)] = new BlockInventory(
        block.getComponent("inventory").container
      );
    }
  }
}, 100);

// src/modules/protections/nuker.ts
var log2 = new PlayerLog();
var IMPOSSIBLE_BREAK_TIME = 70;
var VAILD_BLOCK_TAGS = [
  "snow",
  "lush_plants_replaceable",
  "azalea_log_replaceable",
  "minecraft:crop",
  "fertilize_area"
];
var IMPOSSIBLE_BREAKS = [
  "minecraft:water",
  "minecraft:flowing_water",
  "minecraft:lava",
  "minecraft:flowing_lava",
  "minecraft:bedrock"
];
var ViolationCount3 = new PlayerLog();
world20.events.blockBreak.subscribe(
  ({ block, brokenBlockPermutation, dimension, player }) => {
    if (["moderator", "admin"].includes(getRole(player)))
      return;
    if (block.getTags().some((tag) => VAILD_BLOCK_TAGS.includes(tag)))
      return;
    const old = log2.get(player);
    log2.set(player, Date.now());
    if (!old)
      return;
    if (IMPOSSIBLE_BREAKS.includes(block.typeId))
      return;
    if (old < Date.now() - IMPOSSIBLE_BREAK_TIME)
      return;
    const nuker_data = TABLES.config.get("nuker_data") ?? {
      violationCount: 0,
      banPlayer: false
    };
    const count = (ViolationCount3.get(player) ?? 0) + 1;
    ViolationCount3.set(player, count);
    if (nuker_data.banPlayer && count >= nuker_data.violationCount)
      new Ban(player, null, null, "Using Nuker");
    dimension.getBlock(block.location).setPermutation(brokenBlockPermutation.clone());
    if (BLOCK_CONTAINERS2.includes(brokenBlockPermutation.type.id)) {
      const OLD_INVENTORY = CONTAINER_LOCATIONS[JSON.stringify(block.location)];
      if (OLD_INVENTORY) {
        OLD_INVENTORY.load(block.getComponent("inventory").container);
      }
    }
    setTickTimeout(() => {
      [
        ...dimension.getEntities({
          maxDistance: 2,
          type: "minecraft:item",
          location: new Location5(
            block.location.x,
            block.location.y,
            block.location.z
          )
        })
      ].forEach((e2) => e2.kill());
    }, 0);
  }
);

// src/modules/protections/spam.ts
import { world as world21 } from "@minecraft/server";
var previousMessage = new PlayerLog();
var ViolationCount4 = new PlayerLog();
world21.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX))
    return;
  if (["admin", "moderator"].includes(getRole(data.sender)))
    return;
  const spam_config = TABLES.config.get("spam_config") ?? {
    repeatedMessages: true,
    zalgo: true,
    violationCount: 0,
    permMutePlayer: false
  };
  const isSpam = () => {
    const count = (ViolationCount4.get(data.sender) ?? 0) + 1;
    ViolationCount4.set(data.sender, count);
    if (spam_config.permMutePlayer && count >= spam_config.violationCount)
      new Mute(data.sender, null, null, "Reached Violation count");
  };
  if (spam_config.repeatedMessages && previousMessage.get(data.sender) == data.message) {
    data.cancel = true;
    isSpam();
    return data.sender.tell(`\xA7cRepeated message detected!`);
  }
  if (spam_config.zalgo && /%CC%/g.test(encodeURIComponent(data.message))) {
    data.cancel = true;
    isSpam();
    return data.sender.tell(
      `\xA7cYou message contains some type of zalgo and cannot be sent!`
    );
  }
  previousMessage.set(data.sender, data.message);
});

// src/modules/events/beforeDataDrivenEntityTriggerEvent.ts
import { Player as Player11, world as world22 } from "@minecraft/server";
var e = world22.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
  if (world22.getDynamicProperty("roleHasBeenSet"))
    return world22.events.beforeDataDrivenEntityTriggerEvent.unsubscribe(e);
  if (!(data.entity instanceof Player11))
    return;
  if (data.id != "rubedo:becomeAdmin")
    return;
  setRole(data.entity, "admin");
  world22.setDynamicProperty("roleHasBeenSet", true);
  world22.setDynamicProperty("worldsOwner", data.entity.id);
  data.entity.tell(
    `\xA7l\xA7cYou have been given admin, the function start will not work anymore!!!!`
  );
});

// src/modules/events/beforeWatchdogTerminate.ts
import { system } from "@minecraft/server";
system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;
  console.warn(`WATCHDOG TRIED TO CRASH = ${data.terminateReason}`);
});

// src/modules/events/worldInitialize.ts
import {
  DynamicPropertiesDefinition,
  EntityTypes,
  MinecraftEntityTypes,
  world as world23
} from "@minecraft/server";

// src/config/objectives.ts
var OBJECTIVES = [];

// src/modules/events/worldInitialize.ts
world23.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  runCommand(`tickingarea add 0 0 0 0 0 0 db true`);
  let def = new DynamicPropertiesDefinition();
  def.defineString("name", 30);
  def.defineNumber("index");
  propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    EntityTypes.get(ENTITY_IDENTIFER)
  );
  let def2 = new DynamicPropertiesDefinition();
  def2.defineString("role", 30);
  propertyRegistry.registerEntityTypeDynamicProperties(
    def2,
    MinecraftEntityTypes.player
  );
  let def3 = new DynamicPropertiesDefinition();
  def3.defineBoolean("roleHasBeenSet");
  def3.defineString("worldsOwner", 100);
  def3.defineBoolean("isLockDown");
  propertyRegistry.registerWorldDynamicProperties(def3);
  for (const obj of OBJECTIVES) {
    world23.scoreboard.addObjective(obj.objective, obj.displayName ?? "");
  }
});

// src/index.ts
console.warn(`---- STARTING RUBEDO ----`);
var NPC_LOCATIONS = [];
function clearNpcLocations() {
  NPC_LOCATIONS = [];
}
var CURRENT_TICK = null;
var AIR = new ItemStack4(MinecraftItemTypes5.stick, 0);
world24.events.tick.subscribe((data) => {
  if (!CURRENT_TICK) {
    CURRENT_TICK = data.currentTick;
  } else {
    CURRENT_TICK = CURRENT_TICK + 1;
  }
});
export {
  AIR,
  CURRENT_TICK,
  NPC_LOCATIONS,
  clearNpcLocations
};
//# sourceMappingURL=index.js.map
