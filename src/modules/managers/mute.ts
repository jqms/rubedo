import { world } from "@minecraft/server";
import { PREFIX } from "../../config/commands.js";
import { Mute } from "../models/Mute.js";
import { text } from "../../lang/text.js";
import { TABLES } from "../../lib/Database/tables.js";

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX)) return;
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData) return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(data.sender.name);
  data.cancel = true;
  data.sender.tell(text["modules.managers.mute.isMuted"]());
});
