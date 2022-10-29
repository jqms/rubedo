import { APPEAL_LINK } from "../../config/app.js";
import { TABLES } from "../../lib/Database/tables.js";
import { kick, forEachValidPlayer, MS } from "../../utils.js";

forEachValidPlayer((player) => {
  try {
    const banData = TABLES.bans.get(player.id);
    if (!banData) return;
    console.warn(player.name);
    if (banData.expire && banData.expire < Date.now())
      return TABLES.bans.delete(player.id);
    kick(
      player,
      [
        `§cYou have been banned!`,
        `§aReason: §f${banData.reason}`,
        `§fExpiry: §b${banData.expire ? MS(banData.length) : "Forever"}`,
        `§fAppeal at: §b${TABLES.config.get("appealLink") ?? APPEAL_LINK}`,
      ],
      () => {
        console.warn(new Error("Failed to kick player"));
        TABLES.bans.delete(player.id);
      }
    );
  } catch (error) {
    console.warn(error + error.stack);
  }
}, 20);
