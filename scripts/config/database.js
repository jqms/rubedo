import { BlockLocation } from "mojang-minecraft";
import { DIMENSIONS } from "../utils";
export const MAX_DATABASE_STRING_SIZE = 32000;
export const DATA_REGEX = /(?<=\|\d*\|)(.*)/;
export const ENTITY_ID = "rubedo:database";
export const ENTITY_SPAWN_DIMENSION = DIMENSIONS.overworld;
export const ENTITY_SPAWN_LOCATION = new BlockLocation(0, -64, 0);
