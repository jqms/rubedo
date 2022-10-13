import { Command } from "../../lib/Command/Command";

new Command({ name: "warp" })
  .addArgument("cool", {})
  .addArgument("cool2", "location")
  .addArgument("cool3", "string")
  .executes((ctx, cool) => {
    // teleport player to value
    console.warn(`sds`);
  });
