/**
 * The leeway that the distances can be off before it flags
 */
export const MOVEMENT_DISTANCE_THRESHOLD = 0.7;

/**
 * ~constans of speeds when players are moving
 */
export const MOVEMENT_CONSTANTS = {
  walk: {
    velocity: 0.14,
    distance: 0.21,
  },
  run: {
    velocity: 0.17,
    distance: 0.28,
  },
};

/**
 * The amount of times before the player will be teleported back
 */
export const MOVEMENT_VIOLATION_THRESHOLD = 3;

/**
 * The distance increase per speed effect increase
 */
export const SPEED_EFFECT_INCREASE = 0.056;

/**
 * if the distance is over this amount the system will automaticly flag tp
 */
export const AUTO_FLAG_DISTANCE_THRESHOLD = 10;

/**
 * If your 
 */
export const TAGS = ["gliding", "riding"];
