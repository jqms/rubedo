import { Mute } from "../models/Mute.js";
import { TABLES } from "../../tables.js";
import { text } from "../../../../rubedo/lang/text.js";
import { beforeChat } from "../../../../rubedo/lib/Events/beforeChat.js";

beforeChat.subscribe((data) => {
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData) return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(data.sender.name);
  data.cancel = true;
  data.sender.tell(text["modules.managers.mute.isMuted"]());
});
