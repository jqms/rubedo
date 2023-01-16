import { VERSION } from "../../../../rubedo/config/app";
import { Command } from "../../../../rubedo/lib/Command/Command";

new Command({
  name: "version",
  description: "Get Current Rubedo Version",
  aliases: ["v"],
}).executes((ctx) => {
  ctx.reply(`Current Rubedo Version: ${VERSION}`);
});
