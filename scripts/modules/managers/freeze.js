import { Location, world } from "mojang-minecraft";
import { TABLES } from "../../index.js";
import { forEachValidPlayer, getId } from "../../utils.js";
forEachValidPlayer((player) => {
    const freezeData = TABLES.freezes.get(getId(player));
    if (!freezeData)
        return;
    player.teleport(new Location(freezeData.location.x, freezeData.location.y, freezeData.location.z), world.getDimension(freezeData.location.dimension), 0, 0);
}, 20);
