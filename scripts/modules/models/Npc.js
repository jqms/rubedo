import { clearNpcLocations, NPC_LOCATIONS } from "../../index.js";
import { TABLES } from "../../lib/Database/tables.js";
import { getId } from "../../utils.js";
export class Npc {
    static isVaild(entity) {
        if (entity.id != "minecraft:npc")
            return false;
        if (NPC_LOCATIONS.find((l) => l.equals(entity.location)))
            return true;
        const uid = getId(entity);
        return TABLES.npcs.keys().find((key) => uid == key) ? true : false;
    }
    constructor(location, dimension) {
        NPC_LOCATIONS.push(location);
        const entity = dimension.spawnEntity("minecraft:npc", location);
        const data = {
            dimension: entity.dimension.id,
            x: entity.location.x,
            y: entity.location.y,
            z: entity.location.z,
        };
        TABLES.npcs.set(getId(entity), data);
        clearNpcLocations();
    }
}
