import { ItemStack, MinecraftItemTypes, world } from "mojang-minecraft";
import { BANNED_ITEMS } from "../../config/moderation";
import { ENCHANTMENTS } from "../../config/enchantments";
import { TABLES } from "../../lib/Database/tables";
import { Npc } from "../models/Npc";
import { onSlotChange } from "../../lib/Events/onSlotChange";

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

/**
 * The max a item stack ammount can be
 */
const MAX_STACK_AMMOUNT = 64;

const AIR = new ItemStack(MinecraftItemTypes.stick, 0);

/**
 * This is the max length a itemsNametag can be before its considerd hacked
 */
const MAX_NAMETAG_LENGTH = 32;

/**
 * Enttiies that are not allowed to spawn because they can be used by CBE
 */
const CBE_ENTITIES = ["minecraft:command_block_minecart"];

onSlotChange.subscribe((player, change) => {
  if (!["put", "swap"].includes(change.moveType)) return;
  const clear = () =>
    player.getComponent("inventory").container.setItem(change.slot, AIR);

  if (change.item.amount > MAX_STACK_AMMOUNT) return clear();
  let bannedItems = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
  if (bannedItems.includes(change.item.id)) return clear();
  if (change.item.nameTag?.length > MAX_NAMETAG_LENGTH) return clear();

  const enchs = change.item.getComponent("enchantments").enchantments;
  const MAX_ENCHS = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
  /**
   * List of all enchs that are vaild and on the item
   * Used to test if a enchant appears multiple times!
   */
  const ids: Array<string> = [];
  for (const ench of enchs) {
    let maxLevel = MAX_ENCHS[ench.type.id] ?? ench.type.maxLevel;
    if (enchs.slot == 0 && !enchs.canAddEnchantment(ench)) return clear();
    if (ench.level > maxLevel) return clear();
    if (ids.includes(ench.type.id)) return clear();
    ids.push(ench.type.id);
  }
});

world.events.entityCreate.subscribe((data) => {
  const kill = () => {
    try {
      data.entity.triggerEvent("despawn");
      data.entity.kill();
    } catch (error) {
      data.entity.kill();
    }
  };
  if (CBE_ENTITIES.includes(data.entity.id)) return kill();
  if (data.entity.id == "minecraft:npc" && !Npc.isVaild(data.entity))
    return kill();
});
