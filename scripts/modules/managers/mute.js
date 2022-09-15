import { world } from "mojang-minecraft";
import { TABLES } from "../../index.js";
import { PREFIX } from "../../config/commands.js";
import { broadcast, getId } from "../../utils.js";
import { Mute } from "../models/Mute.js";
import { text } from "../../lang/text.js";

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX)) return;
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData) return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(getId(data.sender));
  data.cancel = true;
  broadcast(text["modules.managers.mute.isMuted"](), data.sender.nameTag);
});
