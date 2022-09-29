import { world } from "mojang-minecraft";
import { kick } from "../../utils.js";
import { PlayerLog } from "../models/PlayerLog";
import { setTickInterval } from "../../lib/Scheduling/utils";
import { text } from "../../lang/text.js";
/**
 * The log of the players hit times
 * resets every seconds
 */
export const CURRENT_CPS = new PlayerLog();
/**
 * The max cps a player could ever have before there hacking or using autoclicker
 */
const MAX_PLAYER_CPS = 15;
world.events.entityHit.subscribe((data) => {
    if (data.entity.id != "minecraft:player")
        return;
    /**
     * The old number of hits per seconds
     */
    const value = (CURRENT_CPS.get(data.entity) ?? 0) + 1;
    CURRENT_CPS.set(data.entity, value);
    if (value > 10)
        data.entity.tell(text["modules.protections.cps.clickingToFast"]());
    if (value > MAX_PLAYER_CPS)
        kick(data.entity, [`§aReason: §fCPS too high: ${value + 1}`]);
});
setTickInterval(() => {
    CURRENT_CPS.clear();
}, 20);
