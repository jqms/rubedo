import {
  BlockLocation,
  Entity,
  Location,
  MinecraftDimensionTypes,
  system,
  Vector3,
  world,
} from "@minecraft/server";

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
 * sets the score of a name
 * @example setScore("Smell of curry", 'Money');
 */
export function setScore(
  entityName: string,
  objective: string,
  value: Number
): void {
  try {
    DIMENSIONS.overworld.runCommandAsync(
      `scoreboard players set "${entityName}" ${objective} ${value}`
    );
  } catch (error) {
    console.warn(error + error.stack);
  }
}

/**
 * Duration converter
 * @param duration time to convert
 * @example ```
 * durationToMs("10s")
 * durationToMs("10d,2y")
 * durationToMs("5m")
 * durationToMs("23ms,10s")
 * ```
 */
const durations: { [unit: string]: number } = {
  y: 3.17098e-11,
  w: 6.048e8,
  d: 8.64e7,
  h: 3.6e6,
  m: 60000,
  s: 1000,
  ms: 1,
};

export function durationToMs(duration: string): number {
  const values: string[] = duration.split(",");
  let ms = 0;
  for (const value of values) {
    const length = parseInt(value.match(/\d+/)[0]);
    const unit = value.match(/[a-zA-Z]+/)[0];
    if (!durations[unit]) {
      throw new Error(`Invalid duration unit: ${unit}`);
    }
    ms += durations[unit] * length;
  }
  return ms;
}

/**
 * Converts a date stored in ms to a Date string
 * @param duration milliseconds to convert
 * @returns Date as a string
 */
export function msToTime(duration: number) {
  return new Date(duration).toString();
}

/**
 * Converts a location to a block location
 */
export function vector3ToBlockLocation(loc: Vector3): BlockLocation {
  return new BlockLocation(
    Math.floor(loc.x),
    Math.floor(loc.y),
    Math.floor(loc.z)
  );
}

/**
 * Sleeps your code
 * @param {number} tick time in ticks you want the return to occur
 * @returns {Promise<void>}
 */
export function sleep(tick: number): Promise<void> {
  return new Promise((resolve) => {
    let runScheduleId = system.runSchedule(() => {
      resolve();
      system.clearRunSchedule(runScheduleId);
    }, tick);
  });
}

/**
 * Checks if a location equals another location
 * @param a first location
 * @param b location to test against first
 * @returns {boolean} if they locations are the same
 */
export function LocationEquals(
  a: Vector3 | Location | BlockLocation,
  b: Vector3 | Location | BlockLocation
): boolean {
  if (a instanceof BlockLocation || b instanceof BlockLocation) {
    return ~~a.x === ~~b.x && ~~a.y === ~~b.y && ~~a.z === ~~b.z;
  }
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

/**
 * Sorts 3D vectors to a min and max vector
 * @param vector1
 * @param vector2
 * @returns {[Vector3, Vector3]}
 */
export function sort3DVectors(
  vector1: Vector3,
  vector2: Vector3
): [Vector3, Vector3] {
  [vector1.x, vector2.x] = [
    Math.min(vector1.x, vector2.x),
    Math.max(vector1.x, vector2.x),
  ];
  [vector1.y, vector2.y] = [
    Math.min(vector1.y, vector2.y),
    Math.max(vector1.y, vector2.y),
  ];
  [vector1.z, vector2.z] = [
    Math.min(vector1.z, vector2.z),
    Math.max(vector1.z, vector2.z),
  ];
  return [vector1, vector2];
}
/**
 * Checks if a target vector is between two vectors
 * @param target
 * @param vector1
 * @param vector2
 * @returns
 */
export function betweenVector3(
  target: Vector3,
  vector1: Vector3,
  vector2: Vector3
): boolean {
  const [minVector, maxVector] = sort3DVectors(vector1, vector2);
  const { x, y, z } = target;
  return (
    x >= minVector.x &&
    x <= maxVector.x &&
    y >= minVector.y &&
    y <= maxVector.y &&
    z >= minVector.z &&
    z <= maxVector.z
  );
}

/**
 * Splits a string into chunk sizes
 */
export function chunkString(str: string, length: number): string[] {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}

/**
 * Splits a string into an array of arrays of strings with a maximum length of 32767 characters per string in the innermost array.
 * @param str The input string to split.
 * @param maxLength Max Length of the 1st array
 * @param subArraysMaxLength Max Length of the strings in the 2d array
 * @returns A two-dimensional array of strings, where each inner array has a maximum length of 2147483647.
 */
export function splitString(
  str: string,
  maxLength: number,
  subArraysMaxLength: number
): string[][] {
  const subStrings: string[] = [];
  for (let i = 0; i < str.length; i += maxLength) {
    subStrings.push(str.slice(i, i + maxLength));
  }

  const subArrays: string[][] = [];
  for (const subString of subStrings) {
    subArrays.push(
      Array.from(
        { length: Math.ceil(subString.length / subArraysMaxLength) },
        (_, i) =>
          subString.slice(i * subArraysMaxLength, (i + 1) * subArraysMaxLength)
      )
    );
  }

  return subArrays;
}