import { BlockLocation } from "mojang-minecraft";
import { DIMENSIONS } from "../utils";

/*
|--------------------------------------------------------------------------
| Max Databse string size
|--------------------------------------------------------------------------
|
| Here is the max database save size meaing when a save gets made
| it tests the size of that save and splits up the save depending on this
| Size. Its releated to minecrafts 32k bit limit.
|
*/
export const MAX_DATABASE_STRING_SIZE = 32000;

/*
|--------------------------------------------------------------------------
| Entity Id
|--------------------------------------------------------------------------
|
| This is the entity id of the database this is what stores the information
| of the database on its nameTag
|
*/
export const ENTITY_IDENTIFER = "rubedo:database";

/*
|--------------------------------------------------------------------------
| Entity Spawn Dimension
|--------------------------------------------------------------------------
|
| This is the dimension where the database entitys are located
|
*/
export const ENTITY_DIMENSION = DIMENSIONS.overworld;

/*
|--------------------------------------------------------------------------
| Entity Spawn Location
|--------------------------------------------------------------------------
|
| This is the spawn location of the database entitys there will be
| Multiple entitys at this location for each chunk
|
*/
export const ENTITY_LOCATION = new BlockLocation(0, -64, 0);
