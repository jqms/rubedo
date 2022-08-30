import { EntityTypes } from "mojang-minecraft";

/*
|--------------------------------------------------------------------------
| Version
|--------------------------------------------------------------------------
|
| This is the version of the API this will be updated every time
| we create a new version and release it on github
| recomended to NOT CHANGE could cause bugs.
|
*/
export const VERSION = "3.0.0";

/*
|--------------------------------------------------------------------------
| Game Version
|--------------------------------------------------------------------------
|
| This is the version of minecraft that this version of smelly api
| was made for its a simple constant to tell creators what version
| this gametest api is supposed to work perfectly for.
|
*/
export const GAME_VERSION = "1.19.0";

/*
|--------------------------------------------------------------------------
| Objectives
|--------------------------------------------------------------------------
|
| This is a list of all objectives this pack uses
| please add any objective to this list so it can be added at world creation
| make sure to add them beofre sending pack to others and new worlds.
|
*/
/**
 * @typedef {Object} Objective
 * @property {string} objective the objective id of this objective
 * @property {string} displayName the display name of this objective
 */
/**
 * @type {Array<Objective>}
 */
export const OBJECTIVES = [
  {
    objective: "minutes",
    displayName: null,
  },
  {
    objective: "coins",
    displayName: null,
  },
  {
    objective: "kills",
    displayName: null,
  },
  {
    objective: "deaths",
    displayName: null,
  },
  {
    objective: "container_open",
    displayName: null,
  },
];

/*
|--------------------------------------------------------------------------
| Dynamic Propertys
|--------------------------------------------------------------------------
|
| This is a list of all objectives this pack uses
| please add any objective to this list so it can be added at world creation
| make sure to add them beofre sending pack to others and new worlds.
|
*/
const PROPERTYS = [
  {
    type: "entity",
    entityType: EntityTypes.get("binocraft:floating_text"),
    get: () => {
      let q = new DynamicPropertiesDefinition();
      q.defineString("objective", 16);
      return q;
    },
  },
];
