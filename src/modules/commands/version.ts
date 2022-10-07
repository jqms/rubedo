import { Command } from "../../lib/Commands/Command.js";
import { VERSION } from "../../config/app";

new Command(
  {
    name: "version",
    description: "Get Current Version",
    aliases: ["v"],
  },
  (ctx) => {
    ctx.reply(`Current Rubedo Version: ${VERSION}`);
  }
);
