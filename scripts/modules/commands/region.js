import { BlockLocation } from "mojang-minecraft";
import { Command } from "../../lib/Commands/Command.js";
import { Region } from "../models/Region.js";
import { getRole } from "../../utils.js";
const command = new Command({
    name: "region",
    description: "Create a Region",
    hasPermission: (player) => getRole(player) == "admin",
});
command
    .addSubCommand({
    name: "add",
    description: "Adds a new protection region",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("from_x", "int", "The starting x of the region")
    .addOption("from_z", "int", "The starting z of the region")
    .addOption("to_x", "int", "The ending x of the region")
    .addOption("to_z", "int", "The ending z of the region")
    .executes((ctx, { from_x, from_z, to_x, to_z }) => {
    new Region({ x: from_x, z: from_z }, { x: to_x, z: to_z }, ctx.sender.dimension.id);
    ctx.reply(`Created Region From ${from_x} -64 ${from_z} ${to_x} 320 ${to_z}`);
});
command.addSubCommand({
    name: "remove",
    description: "Removes a region at the players current postion",
    hasPermission: (player) => getRole(player) == "admin",
}, (ctx) => {
    const loc = new BlockLocation(ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z);
    const r = Region.removeRegionAtBlockLocation(loc, ctx.sender.dimension.id);
    if (r) {
        ctx.reply(`Removed Region at ${loc.x} ${loc.y} ${loc.z}`);
    }
    else {
        ctx.reply(`Failed to find/remove region at ${loc.x} ${loc.y} ${loc.z}`);
    }
});
command.addSubCommand({
    name: "removeAll",
    description: "Removes all regions",
    hasPermission: (player) => getRole(player) == "admin",
}, (ctx) => {
    Region.getAllRegions().forEach((r) => r.delete());
    ctx.reply(`Removed All regions`);
});
command.addSubCommand({
    name: "list",
    description: "Lists all regions and positions",
    hasPermission: (player) => getRole(player) == "admin",
}, (ctx) => {
    const regions = Region.getAllRegions();
    for (const region of regions) {
        ctx.reply(`Region from ${region.from.x}, ${region.from.z} to ${region.to.x}, ${region.to.z} in dimension ${region.dimensionId}`);
    }
    if (regions.length == 0)
        return ctx.reply(`No regions have been made yet`);
});
const permission = command.addSubCommand({
    name: "permission",
    description: "Handels permissions for regions",
    hasPermission: (player) => getRole(player) == "admin",
});
permission
    .addSubCommand({
    name: "set",
    description: "Sets a certin permission on the region the player is currently in to a value",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("key", ["doorsAndSwitches", "openContainers", "pvp"], "The region permission to change")
    .addOption("value", "boolean", "If this permission should be on or off")
    .executes((ctx, { key, value }) => {
    const region = Region.blockLocationInRegion(new BlockLocation(ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z), ctx.sender.dimension.id);
    if (!region)
        return ctx.reply(`You are not in a region`);
    region.changePermission(key, value);
    ctx.reply(`Changed permision ${key} to ${value}`);
});
permission.addSubCommand({
    name: "list",
    description: "Lists the permissions for the current region",
    hasPermission: (player) => getRole(player) == "admin",
}, (ctx) => {
    const region = Region.blockLocationInRegion(new BlockLocation(ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z), ctx.sender.dimension.id);
    if (!region)
        return ctx.reply(`You are not in a region`);
    ctx.reply(`Current region permissions ${JSON.stringify(region.permissions)}`);
});
const entityCommands = permission.addSubCommand({
    name: "entities",
    description: "Holds the subCommands for adding or removing allowedEntitys",
    hasPermission: (player) => getRole(player) == "admin",
});
entityCommands
    .addSubCommand({
    name: "add",
    description: "Adds a entity to the allowed entitys list",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("entity", "string", "the entity id to add")
    .executes((ctx, { entity }) => {
    const region = Region.blockLocationInRegion(new BlockLocation(ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z), ctx.sender.dimension.id);
    if (!region)
        return ctx.reply(`You are not in a region`);
    const currentAllowedEntitys = region.permissions.allowedEntitys;
    currentAllowedEntitys.push(entity);
    region.changePermission("allowedEntitys", currentAllowedEntitys);
    ctx.reply(`Added entity ${entity} to the allowed entitys of the region your currently standing in`);
});
entityCommands
    .addSubCommand({
    name: "remove",
    description: "Removes a entity from the allowed entitys in the region",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("entity", "string", "the entity id to add")
    .executes((ctx, { entity }) => {
    const region = Region.blockLocationInRegion(new BlockLocation(ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z), ctx.sender.dimension.id);
    if (!region)
        return ctx.reply(`You are not in a region`);
    let currentAllowedEntitys = region.permissions.allowedEntitys;
    if (!currentAllowedEntitys.includes(entity))
        return ctx.reply(`The entity ${entity} is not allowed to enter the region`);
    currentAllowedEntitys = currentAllowedEntitys.filter((v) => v != entity);
    region.changePermission("allowedEntitys", currentAllowedEntitys);
    ctx.reply(`Removed entity ${entity} to the allowed entitys of the region your currently standing in`);
});
