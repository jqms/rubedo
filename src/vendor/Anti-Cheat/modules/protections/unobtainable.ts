import { Player } from "@minecraft/server";
import { PlayerLog } from "../../../../rubedo/database/types/PlayerLog.js";
import { AIR } from "../../../../rubedo/lib/Chest GUI/index.js";
import { FORBIDDEN_ITEMS } from "../../config/moderation.js";
import { getConfigId, getMaxEnchantmentLevel, getRole } from "../../utils";
import { Ban } from "../models/Ban.js";
import { Log } from "../models/Log.js";
import { Protection } from "../models/Protection.js";

/**
 * Stores violation count for player
 */
const ViolationCount = new PlayerLog<number>();

const protection = new Protection<{
  clearItem: boolean;
  banPlayer: boolean;
  violationCount: number;
}>(
  "unobtainable",
  "Blocks unobtainable items",
  "textures/blocks/end_portal.png",
  true
)
  .setConfigDefault({
    clearItem: {
      description:
        "If the possessed item should be cleared from there inventory",
      defaultValue: true,
    },
    banPlayer: {
      description: "If the player should be banned once hit violation count.",
      defaultValue: true,
    },
    violationCount: {
      description:
        "The amount of times this player can posses a banned item before ban.",
      defaultValue: 3,
    },
  })
  .forEachPlayer((player) => {
    if (getRole(player) == "admin") return;
    const BANNED_ITEMS = new Set(getConfigId("banned_items"));

    const inventory = player.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (!item) continue;
      if (BANNED_ITEMS.has(item.typeId)) return flag(player, i);
      if (FORBIDDEN_ITEMS.includes(item.typeId)) {
        // Log action
        new Log({
          playerName: player.name,
          message: `${player.name} Has obtained a Forbidden item: ${item.typeId}`,
          protection: "unobtainable",
        });
        return inventory.setItem(i, AIR);
      }
      // Player is allowed to have this itemType
      /**
       * List of all enchantments that are valid on this item
       */
      let enchantments = new Set<string>();
      for (const enchantment of item.getComponent("enchantments")
        .enchantments) {
        const MAX_LEVEL = getMaxEnchantmentLevel(enchantment);
        if (enchantment.level > MAX_LEVEL) return flag(player, i);
        if (enchantment.level < 1) return flag(player, i);
        if (enchantments.has(enchantment.type.id)) return flag(player, i);
        // Enchantment Is valid
        enchantments.add(enchantment.type.id);
      }
    }
  });

/**
 * Flags a player for a item they should not have
 * @param player player to flag
 * @param index the index of this item in the players inventory
 */
function flag(player: Player, index: number) {
  const inventory = player.getComponent("inventory").container;
  const item = inventory.getItem(index);
  const data = protection.getConfig();
  // Clear Item
  if (data.clearItem) inventory.setItem(index, AIR);
  // Log action
  new Log({
    playerName: player.name,
    message: `${player.name} Has obtained a unobtainable item: ${item.typeId}`,
    protection: "unobtainable",
  });
  // Violation
  if (!data.banPlayer) return;
  const violations = (ViolationCount.get(player) ?? 0) + 1;
  ViolationCount.set(player, violations);
  if (violations < data.violationCount) return;
  new Ban(player, null, "Possession of Unobtainable item");
}
