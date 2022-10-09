import { world, MinecraftBlockTypes } from "mojang-minecraft";
import { getRole } from "../../utils.js";
import { BANNED_BLOCKS } from "../../config/moderation.js";
import { TABLES } from "../../lib/Database/tables.js";
world.events.blockPlace.subscribe(({ block, player }) => {
    if (["moderator", "admin"].includes(getRole(player)))
        return;
    const bannedBlocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
    if (bannedBlocks.includes(block.id))
        block.setType(MinecraftBlockTypes.air);
});
