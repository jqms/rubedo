import { APPEAL_LINK } from "../../config/app.js";
import { TABLES } from "../../lib/Database/tables.js";
import { kick, forEachValidPlayer, getId, MS } from "../../utils.js";
forEachValidPlayer((player) => {
    try {
        const uid = getId(player);
        const banData = TABLES.bans.get(uid);
        if (!banData)
            return;
        if (banData.expire && banData.expire < Date.now())
            return TABLES.bans.delete(uid);
        kick(player, [
            `§cYou have been banned!`,
            `§aReason: §f${banData.reason}`,
            `§fExpiry: §b${banData.expire ? MS(banData.length) : "Forever"}`,
            `§fAppeal at: §b${TABLES.config.get("appealLink") ?? APPEAL_LINK}`,
        ], () => {
            TABLES.bans.delete(uid);
        });
    }
    catch (error) {
        console.warn(error + error.stack);
    }
}, 20);
