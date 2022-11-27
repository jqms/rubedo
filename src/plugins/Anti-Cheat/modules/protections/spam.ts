import { world } from "@minecraft/server";
import { PREFIX } from "../../../../config/commands";
import { getConfigId, getRole } from "../../utils";
import { Mute } from "../models/Mute";
import { PlayerLog } from "../models/PlayerLog";

const previousMessage = new PlayerLog<string>();

/**
 * Stores per world load violation data for players
 */
const ViolationCount = new PlayerLog<number>();

world.events.beforeChat.subscribe((data) => {
  if (data.message.startsWith(PREFIX)) return;
  if (["admin", "moderator"].includes(getRole(data.sender))) return;
  const spam_config = getConfigId("spam_config");
  const isSpam = () => {
    const count = (ViolationCount.get(data.sender) ?? 0) + 1;
    ViolationCount.set(data.sender, count);
    if (spam_config.permMutePlayer && count >= spam_config.violationCount)
      new Mute(data.sender, null, "Spamming");
  };
  if (
    spam_config.repeatedMessages &&
    previousMessage.get(data.sender) == data.message
  ) {
    data.cancel = true;
    isSpam();
    return data.sender.tell(`§cRepeated message detected!`);
  }
  if (spam_config.zalgo && /%CC%/g.test(encodeURIComponent(data.message))) {
    data.cancel = true;
    isSpam();
    return data.sender.tell(
      `§cYou message contains some type of zalgo and cannot be sent!`
    );
  }
  previousMessage.set(data.sender, data.message);
});
