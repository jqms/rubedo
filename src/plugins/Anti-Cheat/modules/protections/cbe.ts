import { world, Player, MinecraftBlockTypes } from "@minecraft/server";
import { FORBIDDEN_BLOCKS } from "../../config/moderation";
import { Npc } from "../models/Npc";
import { getConfigId, getRole } from "../../utils";
import { Ban } from "../models/Ban";

/**
 * Enttiies that are not allowed to spawn because they can be used by CBE
 */
const CBE_ENTITIES = ["minecraft:command_block_minecart", "minecraft:npc"];

world.events.entityCreate.subscribe(({ entity }) => {
  const kill = () => {
    try {
      entity.triggerEvent("despawn");
      entity.kill();
    } catch (error) {
      entity.kill();
    }
  };
  if (CBE_ENTITIES.includes(entity.typeId)) return kill();
  if (entity.typeId == "minecraft:npc" && !Npc.isVaild(entity)) return kill();
});

world.events.beforeItemUseOn.subscribe((data) => {
  if (!(data.source instanceof Player)) return;
  if (["moderator", "admin"].includes(getRole(data.source))) return;
  if (FORBIDDEN_BLOCKS.includes(data.item.typeId)) {
    data.cancel = true;
    return;
  }
  const BANNED_BLOCKS = getConfigId("banned_blocks");
  console.warn(JSON.stringify(BANNED_BLOCKS));
  if (!BANNED_BLOCKS.includes(data.item.typeId)) return;
  data.cancel = true;
  new Ban(data.source, null, "Placing Banned Blocks");
});

world.events.beforeItemUseOn.subscribe((data) => {
  if (!(data.source instanceof Player)) return;
  if (!data.item.typeId.endsWith("spawn_egg")) return;
  if (["admin", "moderator"].includes(getRole(data.source))) return;
  const block = data.source.dimension.getBlock(data.blockLocation);
  if (block.typeId == MinecraftBlockTypes.mobSpawner.id) return;
  // Cancel use so players cant use spawnEggs on floor
  data.cancel = true;
  data.source.tell(`§c[Rubedo]: You cannot place spawnEggs on the floor!`);
  data.source.playSound(`note.bass`);
});
