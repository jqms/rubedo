import { world, BlockLocation, MinecraftBlockTypes, } from "mojang-minecraft";
import { STAFF_DB_SCORES, STAFF_SCOREBOARD } from "./config/staff";
import { text } from "./lang/text";
import { Region } from "./modules/models/Region.js";
/**
 * Kicks a player
 */
export function kick(player, message = [], onFail) {
    try {
        player.runCommand(`kick "${player.nameTag}" §r${message.join("\n")}`);
        player.triggerEvent("kick");
    }
    catch (error) {
        if (!/"statusCode":-2147352576/.test(error))
            return;
        // This function just tried to kick the owner
        if (onFail)
            onFail();
    }
}
/**
 * Get score of an entity
 * @example getScore(Entity, 'Money');
 */
function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    }
    catch (error) {
        return 0;
    }
}
/**
 * sets the score of a name
 * @example setScore("Smell of curry", 'Money');
 */
function setScore(entityName, objective, value) {
    try {
        return world
            .getDimension("overworld")
            .runCommand(`scoreboard players set "${entityName}" ${objective} ${value}`);
    }
    catch (error) {
        console.warn(error + error.stack);
    }
}
/**
 * Gets the role of this player
 * @param {Player} player player to get role from
 * @returns {"member" | "moderator" | "admin"}
 * @example getRole("Smell of curry")
 */
export function getRole(player) {
    const score = getScore(player, STAFF_SCOREBOARD);
    return STAFF_DB_SCORES[score];
}
/**
 * Sets the role of this player
 * @example setRole("Smell of curry", "admin")
 */
export function setRole(playerName, value) {
    const num = parseInt(Object.keys(STAFF_DB_SCORES).find((key) => STAFF_DB_SCORES[key] == value) ??
        "0");
    setScore(playerName, STAFF_SCOREBOARD, num);
}
/**
 * Sets Deny blocks at bottom of region every 5 mins
 */
export function loadRegionDenys() {
    for (const region of Region.getAllRegions()) {
        const loc1 = new BlockLocation(region.from.x, -64, region.from.z);
        const loc2 = new BlockLocation(region.to.x, -64, region.to.z);
        for (const blockLocation of loc1.blocksBetween(loc2)) {
            world
                .getDimension(region.dimensionId)
                .getBlock(blockLocation)
                ?.setType(MinecraftBlockTypes.deny);
        }
    }
}
const CALLBACKS = [];
/**
 * Sends a callback for each player
 */
export function forEachValidPlayer(callback, delay = 0) {
    CALLBACKS.push({ callback: callback, delay: delay, lastCall: 0 });
}
world.events.tick.subscribe((tick) => {
    const players = [...world.getPlayers()];
    for (const [i, player] of players.entries()) {
        if (["moderator", "admin"].includes(getRole(player)))
            return;
        for (const CALLBACK of CALLBACKS) {
            if (CALLBACK.delay != 0 &&
                tick.currentTick - CALLBACK.lastCall < CALLBACK.delay)
                continue;
            CALLBACK.callback(player, tick);
            if (i == players.length - 1)
                CALLBACK.lastCall = tick.currentTick;
        }
    }
});
/**
 * Runs a Command
 * @param command a minecraft /command
 * @param dimension: "overworld" | "nether" | "the end"
 * @param debug: true console logs the command, else it runs command
 * @example runCommand(`say test`)
 */
export function runCommand(command, dimension = "overworld", debug = false) {
    try {
        return debug
            ? console.warn(JSON.stringify(this.runCommand(command)))
            : world.getDimension(dimension).runCommand(command);
    }
    catch (error) {
        return { error: true };
    }
}
/**
 * Gets a entitys Unique World Identifer
 */
export function getId(entity) {
    try {
        return entity.scoreboard.id.toString();
    }
    catch (error) {
        try {
            entity.runCommand("scoreboard objectives add test dummy");
        }
        catch (error) { }
        try {
            entity.runCommand("scoreboard players add @s test 0");
        }
        catch (error) { }
        return entity.scoreboard.id.toString();
    }
}
export function MS(value, { compactDuration, fullDuration, avoidDuration } = {}) {
    try {
        if (typeof value === "string") {
            // @ts-ignore
            if (/^\d+$/.test(value))
                return Number(value);
            const durations = value.match(/-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi);
            // @ts-ignore
            return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
        }
        if (typeof value === "number")
            // @ts-ignore
            return toDuration(value, {
                compactDuration,
                fullDuration,
                avoidDuration,
            });
        throw new Error(text["api.utilities.formatter.error.ms"](value));
    }
    catch (err) {
        const message = isError(err)
            ? `${err.message}. Value = ${JSON.stringify(value)}`
            : text["api.error.unknown"]();
        throw new Error(message);
    }
}
/**
 * Convert Durations to milliseconds
 */
export function toMS(value) {
    const number = Number(value.replace(/[^-.0-9]+/g, ""));
    value = value.replace(/\s+/g, "");
    if (/\d+(?=y)/i.test(value))
        return number * 3.154e10;
    else if (/\d+(?=w)/i.test(value))
        return number * 6.048e8;
    else if (/\d+(?=d)/i.test(value))
        return number * 8.64e7;
    else if (/\d+(?=h)/i.test(value))
        return number * 3.6e6;
    else if (/\d+(?=m)/i.test(value))
        return number * 60000;
    else if (/\d+(?=s)/i.test(value))
        return number * 1000;
    else if (/\d+(?=ms|milliseconds?)/i.test(value))
        return number;
    return 0;
}
/**
 * Convert milliseconds to durations
 */
export function toDuration(value, { compactDuration, fullDuration, avoidDuration } = {}) {
    const absMs = Math.abs(value);
    const duration = [
        { short: "w", long: "week", duration: Math.floor(absMs / 6.048e8) },
        { short: "d", long: "day", duration: Math.floor(absMs / 8.64e7) % 7 },
        { short: "h", long: "hour", duration: Math.floor(absMs / 3.6e6) % 24 },
        { short: "m", long: "minute", duration: Math.floor(absMs / 60000) % 60 },
        { short: "s", long: "second", duration: Math.floor(absMs / 1000) % 60 },
        { short: "ms", long: "millisecond", duration: absMs % 1000 },
    ];
    const mappedDuration = duration
        .filter((obj) => obj.duration !== 0 && avoidDuration
        ? fullDuration &&
            !avoidDuration.map((v) => v.toLowerCase()).includes(obj.short)
        : obj.duration)
        .map((obj) => `${Math.sign(value) === -1 ? "-" : ""}${compactDuration
        ? `${Math.floor(obj.duration)}${obj.short}`
        : `${Math.floor(obj.duration)} ${obj.long}${obj.duration === 1 ? "" : "s"}`}`);
    const result = fullDuration
        ? mappedDuration.join(compactDuration ? " " : ", ")
        : mappedDuration[0];
    return result || `${absMs}`;
}
/**
 * A type guard for errors.
 */
export function isError(error) {
    return typeof error === "object" && error !== null && "message" in error;
}
