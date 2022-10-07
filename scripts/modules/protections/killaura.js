import { world } from "mojang-minecraft";
import { setTickInterval } from "../../lib/Scheduling/utils.js";
import { Ban } from "../models/Ban";
import { PlayerLog } from "../models/PlayerLog";
const log = new PlayerLog();
const KILLAURA_KICK_NUMBER = 10;
world.events.entityHit.subscribe((data) => {
    if (data.entity.getEntitiesFromViewVector()[0] == data.hitEntity)
        return;
    const value = (log.get(data.entity) ?? 0) + 1;
    log.set(data.entity, value);
    if (value <= KILLAURA_KICK_NUMBER)
        return;
    new Ban(data.entity, null, null, "Kill aura");
});
setTickInterval(() => {
    log.clear();
}, 20);
