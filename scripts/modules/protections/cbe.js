import { world, } from "mojang-minecraft";
import { BANNED_ITEMS } from "../../config/moderation";
import { ENCHANTMENTS } from "../../config/enchantments";
import { forEachValidPlayer } from "../../utils";
import { NPC_LOCATIONS, TABLES } from "../../index.js";
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
/**
 * This is the max length a itemsNametag can be before its considerd hacked
 */
const MAX_NAMETAG_LENGTH = 32;
/**
 * Enttiies that are not allowed to spawn because they can be used by CBE
 */
const CBE_ENTITIES = ["minecraft:command_block_minecart"];
forEachValidPlayer((player) => {
    /**
     * @type {InventoryComponentContainer}
     */
    const container = player.getComponent("minecraft:inventory").container;
    const item = container.getItem(player.selectedSlot);
    if (!item)
        return;
    const clear = () => player.runCommand(`replaceitem entity @s slot.hotbar ${player.selectedSlot} air`);
    if (item.amount > MAX_STACK_AMMOUNT)
        return clear();
    let bannedItems = TABLES.config.get("banned_items") ?? BANNED_ITEMS;
    if (bannedItems.includes(item.id))
        return clear();
    if (item.nameTag?.length > MAX_NAMETAG_LENGTH)
        return clear();
    /**
     * @type {EnchantmentList}
     */
    const enchs = item.getComponent("enchantments").enchantments;
    const MAX_ENCHS = TABLES.config.get("enchantments") ?? ENCHANTMENTS;
    /**
     * List of all enchs that are vaild and on the item
     * Used to test if a enchant appears multiple times!
     */
    const ids = [];
    for (const ench of enchs) {
        let maxLevel = MAX_ENCHS[ench.type.id] ?? ench.type.maxLevel;
        if (enchs.slot == 0 && !enchs.canAddEnchantment(ench))
            return clear();
        if (ench.level > maxLevel)
            return clear();
        if (ids.includes(ench.type.id))
            return clear();
        ids.push(ench.type.id);
    }
}, 5);
world.events.entityCreate.subscribe((data) => {
    const kill = () => {
        try {
            data.entity.triggerEvent("despawn");
            data.entity.kill();
        }
        catch (error) {
            data.entity.kill();
        }
    };
    if (CBE_ENTITIES.includes(data.entity.id))
        return kill();
    if (data.entity.id == "minecraft:npc" &&
        !NPC_LOCATIONS.find((v) => v.equals(data.entity.location)))
        return kill();
});
