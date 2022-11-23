import {
  EnchantmentList,
  ItemStack,
  MinecraftItemTypes,
  world,
  Player,
} from "@minecraft/server";
import { BANNED_BLOCKS, BANNED_ITEMS } from "../../config/moderation";
import { ENCHANTMENTS } from "../../config/enchantments";
import { TABLES } from "../../lib/Database/tables";
import { Npc } from "../models/Npc";
import { forEachValidPlayer, getRole } from "../../utils";
import { PlayerLog } from "../models/PlayerLog";
import { Ban } from "../models/Ban";

/**
 * Minecraft Bedrock Anti CBE
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This is a anti hacked items, meaning it checks a players inventory every
 * tick then it tests if they have any banned items, then checks if they have
 * items that have hacked enchants and clears the item from inventory
 * --------------------------------------------------------------------------
 */

const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

/**
 * Enttiies that are not allowed to spawn because they can be used by CBE
 */
const CBE_ENTITIES = ["minecraft:command_block_minecart"];

/**
 * Stores per world load violation data for players
 */
const ViolationCount = new PlayerLog<number>();

forEachValidPlayer((player) => {
  const cbe_data = TABLES.config.get("cbe_config") ?? {
    clearItem: true,
    violationCount: 0,
    banPlayer: false,
    canAddEnchantment: false,
  };
  const inventory = player.getComponent("inventory").container;
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (!item) continue;
    const clear = () => {
      console.warn(`[Protection: CBE]: ${player.name} Has a CBE item!`);
      if (cbe_data.clearItem)
        player.getComponent("inventory").container.setItem(i, AIR);
      const count = (ViolationCount.get(player) ?? 0) + 1;
      ViolationCount.set(player, count);
      if (cbe_data.banPlayer && count >= cbe_data.violationCount)
        new Ban(player, null, null, "Cbe Detection");
    };

    let bannedItems = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (bannedItems.includes(item.typeId)) return clear();

    const enchs: EnchantmentList =
      item.getComponent("enchantments").enchantments;
    const MAX_ENCHS = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    /**
     * List of all enchs that are vaild and on the item
     * Used to test if a enchant appears multiple times!
     */
    const ids: Array<string> = [];
    for (const ench of enchs) {
      let maxLevel = MAX_ENCHS[ench.type.id] ?? ench.type.maxLevel;
      if (
        enchs.slot == 0 &&
        !cbe_data.canAddEnchantment &&
        !enchs.canAddEnchantment(ench)
      )
        return clear();
      if (ench.level > maxLevel || ench.level < 1) return clear();
      if (ids.includes(ench.type.id)) return clear();
      ids.push(ench.type.id);
    }
  }
});

world.events.entityCreate.subscribe(({ entity }) => {
  if (entity.typeId != "minecraft:npc") return;
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
  const bannedBlocks = TABLES.config.get("banned_blocks") ?? BANNED_BLOCKS;
  if (!bannedBlocks.includes(data.item.typeId)) return;
  data.cancel = true;
  new Ban(data.source, null, "Placing Banned Block");
});

world.events.blockPlace.subscribe(({ player, block }) => {
  if (!["minecraft:chest", "minecraft:trapped_chest"].includes(block.typeId))
    return;
  const container = block.getComponent("inventory")?.container;
  if (!container) return;
  let bannedItems = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
  for (let i = 0; i < container.size; i++) {
    const item = container.getItem(i);
    if (!item) continue;
    if (!bannedItems.includes(item.typeId)) continue;
    block.dimension.runCommandAsync(
      `setblock ${block.x} ${block.y} ${block.z} air`
    );
    new Ban(player, null, "Placing Chest with Banned Items");
    return;
  }
});
