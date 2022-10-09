import { MinecraftBlockTypes, world, } from "mojang-minecraft";
const MAX_REACH_LIMIT = 7;
function isReach(p1, p2) {
    return (Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2) >
        MAX_REACH_LIMIT);
}
world.events.beforeItemUseOn.subscribe((data) => {
    if (!isReach(data.source.location, data.blockLocation))
        return;
    data.cancel = true;
});
world.events.blockBreak.subscribe((data) => {
    if (!isReach(data.player.location, data.block.location))
        return;
    data.dimension
        .getBlock(data.block.location)
        .setPermutation(data.brokenBlockPermutation);
});
world.events.blockPlace.subscribe((data) => {
    if (!isReach(data.player.location, data.block.location))
        return;
    data.dimension.getBlock(data.block.location).setType(MinecraftBlockTypes.air);
});
world.events.entityHit.subscribe((data) => {
    if (data.hitEntity) {
        if (!isReach(data.entity.location, data.hitEntity.location))
            return;
    }
    else if (data.hitBlock) {
        if (!isReach(data.entity.location, data.hitBlock.location))
            return;
    }
    else {
        return;
    }
});
