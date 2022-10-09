import { world, BlockLocation, MinecraftBlockTypes, MinecraftDimensionTypes, } from "mojang-minecraft";
import { text } from "./lang/text";
import { TABLES } from "./lib/Database/tables";
import { Region } from "./modules/models/Region.js";
import { ChangePlayerRoleTask } from "./modules/models/Task";
export const DIMENSIONS = {
    overworld: world.getDimension(MinecraftDimensionTypes.overworld),
    nether: world.getDimension(MinecraftDimensionTypes.nether),
    theEnd: world.getDimension(MinecraftDimensionTypes.theEnd),
    "minecraft:overworld": world.getDimension(MinecraftDimensionTypes.overworld),
    "minecraft:nether": world.getDimension(MinecraftDimensionTypes.nether),
    "minecraft:the_end": world.getDimension(MinecraftDimensionTypes.theEnd),
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
export function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    }
    catch (error) {
        return 0;
    }
}
export function getScoreByName(name, objective) {
    try {
        const command = DIMENSIONS.overworld.runCommand(`scoreboard players test "${name}" "${objective}" * *`);
        return parseInt(String(command.statusMessage?.split(" ")[1]), 10);
    }
    catch (error) {
        return 0;
    }
}
export function setScore(entityName, objective, value) {
    try {
        return DIMENSIONS.overworld.runCommand(`scoreboard players set "${entityName}" ${objective} ${value}`);
    }
    catch (error) {
        console.warn(error + error.stack);
    }
}
export function getRole(player) {
    if (typeof player == "string") {
        const inGamePlayer = [...world.getPlayers()].find((p) => p.name == player);
        if (inGamePlayer) {
            return inGamePlayer.getDynamicProperty("role");
        }
        else {
            return TABLES.roles.get(player) ?? "member";
        }
    }
    else {
        return player.getDynamicProperty("role");
    }
}
export function setRole(player, value) {
    if (typeof player == "string") {
        TABLES.roles.set(player, value);
        const inGamePlayer = [...world.getPlayers()].find((p) => p.name == player);
        if (inGamePlayer) {
            inGamePlayer.setDynamicProperty("role", value);
        }
        else {
            new ChangePlayerRoleTask(player, value);
        }
    }
    else {
        TABLES.roles.set(player.name, value);
        player.setDynamicProperty("role", value);
    }
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
const CALLBACKS = [];
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
        catch (error) {
            const tagId = entity.getTags().find((t) => t.startsWith("id:"));
            if (tagId)
                return tagId.replace("id:", "");
            const id = Date.now();
            entity.addTag(`id:${id}`);
            return id.toString();
        }
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
export function locationToBlockLocation(loc) {
    return new BlockLocation(Math.floor(loc.x), Math.floor(loc.y), Math.floor(loc.z));
}
