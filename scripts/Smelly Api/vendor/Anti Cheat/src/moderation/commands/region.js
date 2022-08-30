import { SA } from "../../../../../index.js";
import { STAFF_TAG } from "../../config.js";
import { Ban } from "../../utils/Ban.js";
import { Region } from "../../utils/Region.js";

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
  .executes((ctx, { from, to, name }) => {
    new Region(from, to, name);
    ctx.reply(
      `Created Region From ${from.x} -64 ${from.z} ${to.x} 319 ${to.z}`
    );
  });
