import {
  BlockLocation,
  Entity,
  Location,
  MinecraftDimensionTypes,
  system,
  Vector3,
  world,
} from "@minecraft/server";
import { durationSegment, durationSegmentType } from "./types";

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
export function durationToMs(duration: string): number {
  /**
   * This holds the different duration values this duration can have
   * @example `["10d", "20s", "2h"]`
   * @example `["2h"]`
   */
  const values: durationSegment[] = duration.split(",") as durationSegment[];
  console.warn(values.length);
  let ms = 0;
  for (const value of values) {
    const length = parseInt(value.match(/\D+|\d+/g)[0]);
    const unit = value.match(/\D+|\d+/g)[1] as durationSegmentType;
    if (unit == "y") ms = ms + 3.17098e-11 * length;
    if (unit == "w") ms = ms + 6.048e8 * length;
    if (unit == "d") ms = ms + 8.64e7 * length;
    if (unit == "h") ms = ms + 3.6e6 * length;
    if (unit == "m") ms = ms + 60000 * length;
    if (unit == "s") ms = ms + 1000 * length;
    if (unit == "ms") ms = ms + length;
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
  let aLocations = [a.x, a.y, a.z];
  let bLocations = [a.x, a.y, a.z];
  if (a instanceof BlockLocation || b instanceof BlockLocation) {
    aLocations = aLocations.map((v) => Math.trunc(v));
    bLocations = bLocations.map((v) => Math.trunc(v));
  }
  return aLocations.find((v, i) => bLocations[i] != v) ? false : true;
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
  const minVector = {
    x: Math.min(vector1.x, vector2.x),
    y: Math.min(vector1.y, vector2.y),
    z: Math.min(vector1.z, vector2.z),
  };
  const maxVector = {
    x: Math.max(vector1.x, vector2.x),
    y: Math.max(vector1.y, vector2.y),
    z: Math.max(vector1.z, vector2.z),
  };
  return [minVector, maxVector];
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
  return (
    target.x >= minVector.x &&
    target.x <= maxVector.x &&
    target.y >= minVector.y &&
    target.y <= maxVector.y &&
    target.z >= minVector.z &&
    target.z <= maxVector.z
  );
}

/**
 * Splits a string into chunk sizes
 */
export function chunkString(str: string, length: number): string[] {
  return str.match(new RegExp(".{1," + length + "}", "g"));
}
