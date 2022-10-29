import {
  world,
  Player,
  TickEvent,
  BlockLocation,
  MinecraftBlockTypes,
  Entity,
  MinecraftDimensionTypes,
  Location,
} from "@minecraft/server";
import type { ROLES } from "./types";
import { text } from "./lang/text";
import { TABLES } from "./lib/Database/tables";
import { Region } from "./modules/models/Region.js";
import { ChangePlayerRoleTask } from "./modules/models/Task";
import type { IMsOptions, IplayerTickRegister } from "./types";

/**
 * This is to reduce lag when grabbing dimensions keep them set and pre-defined
 */
export const DIMENSIONS = {
  overworld: world.getDimension(MinecraftDimensionTypes.overworld),
  nether: world.getDimension(MinecraftDimensionTypes.nether),
  theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
  "minecraft:overworld": world.getDimension(MinecraftDimensionTypes.overworld),
  "minecraft:nether": world.getDimension(MinecraftDimensionTypes.nether),
  "minecraft:the_end": world.getDimension(MinecraftDimensionTypes.theEnd),
};

/**
 * Kicks a player
 */
export function kick(
  player: Player,
  message: Array<String> = [],
  onFail?: () => void
): void {
  try {
    player.runCommand(`kick "${player.nameTag}" §r${message.join("\n")}`);
    player.triggerEvent("kick");
  } catch (error) {
    if (!/"statusCode":-2147352576/.test(error)) return;
    // This function just tried to kick the owner
    if (onFail) onFail();
  }
}

/**
 * Get score of an entity
 * @example getScore(Entity, 'Money');
 */
export function getScore(entity: Entity, objective: string): number {
  try {
    return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
  } catch (error) {
    return 0;
  }
}

/**
 * grabs the score of a entity off of nameTag
 * @param name Entitys name
 * @param objective objective to get
 * @returns the score of the entity
 */
export function getScoreByName(name: string, objective: string): number {
  try {
    const command = DIMENSIONS.overworld.runCommand(
      `scoreboard players test "${name}" "${objective}" * *`
    );
    return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
  } catch (error) {
    return 0;
  }
}

/**
 * sets the score of a name
 * @example setScore("Smell of curry", 'Money');
 */
export function setScore(
  entityName: string,
  objective: string,
  value: Number
): void {
  try {
    return DIMENSIONS.overworld.runCommand(
      `scoreboard players set "${entityName}" ${objective} ${value}`
    );
  } catch (error) {
    console.warn(error + error.stack);
  }
}

/**
 * Gets the role of this player
 * @param player player to get role from
 * @example getRole("Smell of curry")
 */
export function getRole(player: Player | string): keyof typeof ROLES {
  if (player instanceof Player) {
    return TABLES.roles.get(player.name) ?? "member";
  } else {
    return TABLES.roles.get(player) ?? "member";
  }
}

/**
 * Sets the role of this player
 * @example setRole("Smell of curry", "admin")
 */
export function setRole(
  player: Player | string,
  value: keyof typeof ROLES
): void {
  if (typeof player == "string") {
    // we need to create a task that will update the role for
    // that player when they join
    // also we need to set there db_role back
    TABLES.roles.set(player, value);
    /**
     * If the player is in the game just set it now
     * if they are not in the game we will need to create a task
     * to set there role when they join
     */
    const inGamePlayer = [...world.getPlayers()].find((p) => p.name == player);
    if (inGamePlayer) {
      inGamePlayer.setDynamicProperty("role", value);
    } else {
      new ChangePlayerRoleTask(player, value);
    }
  } else {
    // just change both of them no need for task
    TABLES.roles.set(player.name, value);
    player.setDynamicProperty("role", value);
  }
}

/**
 * Sets Deny blocks at bottom of region every 5 mins
 */
export function loadRegionDenys() {
  for (const region of Region.getAllRegions()) {
    const loc1 = new BlockLocation(region.from.x, -64, region.from.z);
    const loc2 = new BlockLocation(region.to.x, -64, region.to.z);
    for (const blockLocation of loc1.blocksBetween(loc2)) {
      DIMENSIONS[region.dimensionId as keyof typeof DIMENSIONS]
        .getBlock(blockLocation)
        ?.setType(MinecraftBlockTypes.deny);
    }
  }
}

/**
 * Stores all the callbacks in an array
 */
const CALLBACKS: IplayerTickRegister[] = [];

/**
 * Sends a callback for each player
 * @returns the key to disable this callback
 */
export function forEachValidPlayer(
  callback: (player: Player, event: TickEvent) => void,
  delay = 0
) {
  CALLBACKS.push({ callback: callback, delay: delay, lastCall: 0 });
}

world.events.tick.subscribe((tick) => {
  const players = [...world.getPlayers()];
  for (const [i, player] of players.entries()) {
    if (["moderator", "admin"].includes(getRole(player))) continue;
    for (const CALLBACK of CALLBACKS) {
      if (
        CALLBACK.delay != 0 &&
        tick.currentTick - CALLBACK.lastCall < CALLBACK.delay
      )
        continue;
      CALLBACK.callback(player, tick);
      if (i == players.length - 1) CALLBACK.lastCall = tick.currentTick;
    }
  }
});

/**
 * Runs a Command
 * @param command a minecraft /command
 * @param dimension: "overworld" | "nether" | "the end"
 * @param debug: true console logs the command, else it runs command
 * @example runCommand(`say test`)
 */
export function runCommand(
  command: string,
  dimension: string = "overworld",
  debug: boolean = false
): Object {
  try {
    return debug
      ? console.warn(JSON.stringify(this.runCommand(command)))
      : DIMENSIONS.overworld.runCommand(command);
  } catch (error) {
    return { error: true };
  }
}

/**
 * Gets a players id based on a saved database values
 * @param playerName playerName to get
 */
export function getId(playerName: string): string | null {
  return TABLES.ids.get(playerName);
}

export function MS<T extends number | string>(
  value: T,
  { compactDuration, fullDuration, avoidDuration }: IMsOptions = {}
): T extends string ? number : string | null {
  try {
    if (typeof value === "string") {
      // @ts-ignore
      if (/^\d+$/.test(value)) return Number(value);
      const durations = value.match(
        /-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi
      );
      // @ts-ignore
      return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
    }
    if (typeof value === "number")
      // @ts-ignore
      return toDuration(value, {
        compactDuration,
        fullDuration,
        avoidDuration,
      });
    throw new Error(text["api.utilities.formatter.error.ms"](value));
  } catch (err) {
    const message = isError(err)
      ? `${err.message}. Value = ${JSON.stringify(value)}`
      : text["api.error.unknown"]();
    throw new Error(message);
  }
}

/**
 * Convert Durations to milliseconds
 */
export function toMS(value: string): number {
  const number = Number(value.replace(/[^-.0-9]+/g, ""));
  value = value.replace(/\s+/g, "");
  if (/\d+(?=y)/i.test(value)) return number * 3.154e10;
  else if (/\d+(?=w)/i.test(value)) return number * 6.048e8;
  else if (/\d+(?=d)/i.test(value)) return number * 8.64e7;
  else if (/\d+(?=h)/i.test(value)) return number * 3.6e6;
  else if (/\d+(?=m)/i.test(value)) return number * 60000;
  else if (/\d+(?=s)/i.test(value)) return number * 1000;
  else if (/\d+(?=ms|milliseconds?)/i.test(value)) return number;
  return 0;
}

/**
 * Convert milliseconds to durations
 */
export function toDuration(
  value: number,
  { compactDuration, fullDuration, avoidDuration }: IMsOptions = {}
): string {
  const absMs = Math.abs(value);
  const duration = [
    { short: "w", long: "week", duration: Math.floor(absMs / 6.048e8) },
    { short: "d", long: "day", duration: Math.floor(absMs / 8.64e7) % 7 },
    { short: "h", long: "hour", duration: Math.floor(absMs / 3.6e6) % 24 },
    { short: "m", long: "minute", duration: Math.floor(absMs / 60000) % 60 },
    { short: "s", long: "second", duration: Math.floor(absMs / 1000) % 60 },
    { short: "ms", long: "millisecond", duration: absMs % 1000 },
  ];
  const mappedDuration = duration
    .filter((obj) =>
      obj.duration !== 0 && avoidDuration
        ? fullDuration &&
          !avoidDuration.map((v) => v.toLowerCase()).includes(obj.short)
        : obj.duration
    )
    .map(
      (obj) =>
        `${Math.sign(value) === -1 ? "-" : ""}${
          compactDuration
            ? `${Math.floor(obj.duration)}${obj.short}`
            : `${Math.floor(obj.duration)} ${obj.long}${
                obj.duration === 1 ? "" : "s"
              }`
        }`
    );
  const result = fullDuration
    ? mappedDuration.join(compactDuration ? " " : ", ")
    : mappedDuration[0];
  return result || `${absMs}`;
}

/**
 * A type guard for errors.
 */
export function isError(error: any): boolean {
  return typeof error === "object" && error !== null && "message" in error;
}

/**
 * Converts a location to a block location
 */
export function locationToBlockLocation(loc: Location): BlockLocation {
  return new BlockLocation(
    Math.floor(loc.x),
    Math.floor(loc.y),
    Math.floor(loc.z)
  );
}
