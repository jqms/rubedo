import { world } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { APPEAL_LINK } from "../../config.js";
import { db_bans } from "../../index.js";
import { kick } from "../../utils/kick.js";
import { forEachValidPlayer } from "../../utils/Players.js";

forEachValidPlayer((player) => {
  const banData = db_bans.get(SA.Models.entity.getId(player));
  if (!banData) return;
  if (banData.expire && banData.expire < Date.now())
    return db_bans.delete(SA.Models.entity.getId(player));
  kick(player, [
    `§cYou have been banned!`,
    `§aReason: §f${banData.reason}`,
    `§fExpiry: §b${
      banData.expire ? SA.Utilities.format.MS(banData.length) : "Forever"
    }`,
    `§fAppeal at: §b${APPEAL_LINK}`,
  ]);
}, 20);
