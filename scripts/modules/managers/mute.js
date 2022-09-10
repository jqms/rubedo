import { world } from "mojang-minecraft";
import { TABLES } from "../../index.js";
import { PREFIX } from "../../config/commands.js";
import { broadcast, getId } from "../../utils.js";
import { Mute } from "../models/Mute.js";

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX)) return;
  const muteData = Mute.getMuteData(data.sender);
  if (!muteData) return;
  if (muteData.expire && muteData.expire < Date.now())
    return TABLES.mutes.delete(getId(data.sender));
  data.cancel = true;
  broadcast(
    `You are muted and cannot send messages please try again later`,
    data.sender.nameTag
  );
});
