import { world, BlockLocation, MinecraftBlockTypes, MinecraftDimensionTypes, } from "mojang-minecraft";
import { STAFF_DB_SCORES, STAFF_SCOREBOARD } from "./config/staff";
import { text } from "./lang/text";
import { Region } from "./modules/models/Region.js";
export const DIMENSIONS = {
    overworld: world.getDimension(MinecraftDimensionTypes.overworld),
    nether: world.getDimension(MinecraftDimensionTypes.nether),
    theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
};
export function kick(player, message = [], onFail) {
    try {
        player.runCommand(`kick "${player.nameTag}" §r${message.join("\n")}`);
        player.triggerEvent("kick");
    }
    catch (error) {
        if (!/"statusCode":-2147352576/.test(error))
            return;
        if (onFail)
            onFail();
    }
}
function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    }
    catch (error) {
        return 0;
    }
}
function getScoreByName(name, objective) {
    try {
        const command = DIMENSIONS.overworld.runCommand(`scoreboard players test "${name}" "${objective}" * *`);
        return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
    }
    catch (error) {
        return 0;
    }
}
function setScore(entityName, objective, value) {
    try {
        return DIMENSIONS.overworld.runCommand(`scoreboard players set "${entityName}" ${objective} ${value}`);
    }
    catch (error) {
        console.warn(error + error.stack);
    }
}
export function getRole(player) {
    const score = typeof player == "string"
        ? getScoreByName(player, STAFF_SCOREBOARD)
        : getScore(player, STAFF_SCOREBOARD);
    return STAFF_DB_SCORES[score];
}
export function setRole(playerName, value) {
    const num = parseInt(Object.keys(STAFF_DB_SCORES).find((k) => STAFF_DB_SCORES[parseInt(k)] === value));
    setScore(playerName, STAFF_SCOREBOARD, num);
}
export function loadRegionDenys() {
    for (const region of Region.getAllRegions()) {
        const loc1 = new BlockLocation(region.from.x, -64, region.from.z);
        const loc2 = new BlockLocation(region.to.x, -64, region.to.z);
        for (const blockLocation of loc1.blocksBetween(loc2)) {
            DIMENSIONS[region.dimensionId]
                .getBlock(blockLocation)
                ?.setType(MinecraftBlockTypes.deny);
        }
    }
}
const CALLBACKS = {};
export function forEachValidPlayer(callback, delay = 0) {
    const key = Date.now();
    CALLBACKS[key] = { callback: callback, delay: delay, lastCall: 0 };
    return key;
}
export function disableForEachValidPlayer(key) {
    delete CALLBACKS[key];
}
world.events.tick.subscribe((tick) => {
    const players = [...world.getPlayers()];
    for (const [i, player] of players.entries()) {
        if (["moderator", "admin"].includes(getRole(player)))
            return;
        for (const CALLBACK of Object.values(CALLBACKS)) {
            if (CALLBACK.delay != 0 &&
                tick.currentTick - CALLBACK.lastCall < CALLBACK.delay)
                continue;
            CALLBACK.callback(player, tick);
            if (i == players.length - 1)
                CALLBACK.lastCall = tick.currentTick;
        }
    }
});
export function runCommand(command, dimension = "overworld", debug = false) {
    try {
        return debug
            ? console.warn(JSON.stringify(this.runCommand(command)))
            : DIMENSIONS.overworld.runCommand(command);
    }
    catch (error) {
        return { error: true };
    }
}
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
            if (/^\d+$/.test(value))
                return Number(value);
            const durations = value.match(/-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi);
            return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
        }
        if (typeof value === "number")
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
export function isError(error) {
    return typeof error === "object" && error !== null && "message" in error;
}
