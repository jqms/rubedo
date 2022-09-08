/**
 * The scoreboard that is used for staff
 */
export const STAFF_SCOREBOARD = "STAFF_DB";

/**
 * Each key in here has a relation to the score that a player has
 * on the `STAFF_SCOREBOARD` to role
 */
export const STAFF_DB_SCORES = {
  null: "member",
  0: "member",
  1: "admin",
  2: "moderator",
};
