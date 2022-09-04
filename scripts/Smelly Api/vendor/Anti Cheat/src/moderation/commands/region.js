import { BlockLocation } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Region } from "../../Models/Region.js";

const command = new SA.Command({
  name: "region",
  description: "Create a Region",
  tags: [STAFF_TAG],
});

command
  .addSubCommand({
    name: "add",
    description: "Adds a new protection region",
    tags: [STAFF_TAG],
  })
  .addOption("from_x", "int", "The starting x of the region")
  .addOption("from_z", "int", "The starting z of the region")
  .addOption("to_x", "int", "The ending x of the region")
  .addOption("to_z", "int", "The ending z of the region")
  .addOption("name", "string", "The name of this region, ex: Spawn", true)
  .executes((ctx, { from_x, from_z, to_x, to_z, name }) => {
    new Region(
      { x: from_x, z: from_z },
      { x: to_x, z: to_z },
      ctx.sender.dimension.id
    );
    ctx.reply(
      `Created Region From ${from_x} -64 ${from_z} ${to_x} 320 ${to_z}`
    );
  });

command.addSubCommand(
  {
    name: "remove",
    description: "Removes a region at the players current postion",
    tags: [STAFF_TAG],
  },
  (ctx) => {
    const r = Region.removeRegionAtBlockLocation(
      new BlockLocation(
        ctx.sender.location.x,
        ctx.sender.location.y,
        ctx.sender.location.z
      )
    );
    if (r) {
      ctx.reply(
        `Removed Region at ${
          (ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z)
        }`
      );
    } else {
      ctx.reply(
        `Failed to find/remove region at ${
          (ctx.sender.location.x, ctx.sender.location.y, ctx.sender.location.z)
        }`
      );
    }
  }
);

command.addSubCommand(
  {
    name: "list",
    description: "Lists all regions and positions",
    tags: [STAFF_TAG],
  },
  (ctx) => {
    const regions = Region.getAllRegions();
    for (const region of regions) {
      ctx.reply(
        `Region from ${region.from.x}, ${region.from.z} to ${region.to.x}, ${region.to.z} in dimension ${region.dimension}`
      );
    }
    if (regions.length == 0) return ctx.reply(`No regions have been made yet`);
  }
);

const permission = command.addSubCommand({
  name: "permission",
  description: "Handels permissions for regions",
  tags: [STAFF_TAG],
});

permission
  .addSubCommand({
    name: "set",
    description:
      "Sets a certin permission on the region the player is currently in to a value",
    tags: [STAFF_TAG],
  })
  .addOption(
    "key",
    ["doorsAndSwitches", "openContainers", "pvp"],
    "The region permission to change"
  )
  .addOption("value", "boolean", "If this permission should be on or off")
  .executes((ctx, { key, value }) => {
    const region = Region.blockLocationInRegion(
      new BlockLocation(
        ctx.sender.location.x,
        ctx.sender.location.y,
        ctx.sender.location.z
      ),
      ctx.sender.dimension.id
    );
    if (!region) return ctx.reply(`You are not in a region`);
    region.changePermission(key, value);
    ctx.reply(`Changed permision ${key} to ${value}`);
  });

permission.addSubCommand(
  {
    name: "list",
    description: "Lists the permissions for the current region",
    tags: [STAFF_TAG],
  },
  (ctx) => {
    const region = Region.blockLocationInRegion(
      new BlockLocation(
        ctx.sender.location.x,
        ctx.sender.location.y,
        ctx.sender.location.z
      ),
      ctx.sender.dimension.id
    );
    if (!region) return ctx.reply(`You are not in a region`);
    ctx.reply(
      `Current region permissions ${JSON.stringify(region.permissions)}`
    );
  }
);
