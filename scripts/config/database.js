import { BlockLocation, world } from "mojang-minecraft";
export const MAX_DATABASE_STRING_SIZE = 32000;
export const DATA_REGEX = /(?<=\|\d*\|)(.*)/;
export const ENTITY_ID = "rubedo:database";
export const ENTITY_SPAWN_DIMENSION = world.getDimension("overworld");
export const ENTITY_SPAWN_LOCATION = new BlockLocation(0, -64, 0);
