import { BlockLocation, world } from "mojang-minecraft";
/**
 * Returns a location of the inputed aguments
 * @example parseLocationAugs(["~1", "3", "^7"], { location: [1,2,3] , viewVector: [1,2,3] })
 */
export function parseLocationAugs([x, y, z], { location, viewVector }) {
    if (!x || !y || !x)
        return null;
    const a = [x, y, z].map((arg) => {
        const r = parseInt(arg.replace(/\D/g, ""));
        return isNaN(r) ? 0 : r;
    });
    const b = [x, y, z].map((arg, index) => {
        return arg.includes("~")
            ? a[index] + location[index]
            : arg.includes("^")
                ? a[index] + viewVector[index]
                : a[index];
    });
    return new BlockLocation(b[0], b[1], b[2]);
}
/**
 * Fetch an online players data
 */
export function fetch(playerName) {
    return [...world.getPlayers()].find((plr) => plr.name === playerName);
}
