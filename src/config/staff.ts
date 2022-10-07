/**
 * The scoreboard that is used for staff
 */
export const STAFF_SCOREBOARD: string = "STAFF_DB";

/**
 * Each key in here has a relation to the score that a player has
 * on the `STAFF_SCOREBOARD` to role
 */
export const STAFF_DB_SCORES = {
  0: "member",
  1: "admin",
  2: "moderator",
  3: "builder",
} as { [key: number]: string };

export enum ROLES {
  member,
  admin,
  moderator,
  builder,
}
