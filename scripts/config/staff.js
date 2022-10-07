export const STAFF_SCOREBOARD = "STAFF_DB";
export const STAFF_DB_SCORES = {
    0: "member",
    1: "admin",
    2: "moderator",
    3: "builder",
};
export var ROLES;
(function (ROLES) {
    ROLES[ROLES["member"] = 0] = "member";
    ROLES[ROLES["admin"] = 1] = "admin";
    ROLES[ROLES["moderator"] = 2] = "moderator";
    ROLES[ROLES["builder"] = 3] = "builder";
})(ROLES || (ROLES = {}));
