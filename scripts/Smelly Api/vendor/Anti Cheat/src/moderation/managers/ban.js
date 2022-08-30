import { SA } from "../../../../../index.js";
import { APPEAL_LINK } from "../../config.js";
import { db_bans } from "../../index.js";
import { kick, forEachValidPlayer } from "../../utils.js";

forEachValidPlayer((player) => {
  const uid = SA.Models.entity.getId(player);
  const banData = db_bans.get(uid);
  if (!banData) return;
  if (banData.expire && banData.expire < Date.now()) return db_bans.delete(uid);
  kick(
    player,
    [
      `§cYou have been banned!`,
      `§aReason: §f${banData.reason}`,
      `§fExpiry: §b${
        banData.expire ? SA.Utilities.format.MS(banData.length) : "Forever"
      }`,
      `§fAppeal at: §b${APPEAL_LINK}`,
    ],
    () => {
      db_bans.delete(uid);
    }
  );
}, 20);
