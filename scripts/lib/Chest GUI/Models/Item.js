import { Items, ItemStack, MinecraftEnchantmentTypes, } from "mojang-minecraft";
export class Item {
    constructor(id, amount = 1, data = 0, components = {}, itemStack) {
        this.id = id;
        this.amount = amount;
        this.data = data;
        this.components = components;
        this.itemStack = itemStack
            ? itemStack
            : new ItemStack(Items.get(this.id), amount, data);
    }
    static itemStackToItem(item, extras = {}) {
        const enchantments = item.getComponent("enchantments").enchantments;
        const ItemStackEnchantments = [];
        for (const Enchantment in MinecraftEnchantmentTypes) {
            const ItemEnchantment = enchantments.getEnchantment(MinecraftEnchantmentTypes[Enchantment]);
            if (!ItemEnchantment)
                continue;
            ItemStackEnchantments.push(MinecraftEnchantmentTypes[Enchantment]);
        }
        return new Item(item.id, item.amount, item.data, {
            nameTag: item.nameTag,
            lore: item.getLore(),
            enchantments: ItemStackEnchantments,
        });
    }
    setComponents(components = this.components) {
        this.components = components;
        if (components?.nameTag)
            this.itemStack.nameTag = components.nameTag;
        if (this.components?.lore)
            this.itemStack.setLore(this.components.lore);
        if (components?.enchantments?.length > 0) {
            const ItemStackEnchantments = this.itemStack.getComponent("enchantments").enchantments;
            for (const ench of components.enchantments) {
                ItemStackEnchantments.addEnchantment(ench);
            }
            this.itemStack.getComponent("enchantments").enchantments =
                ItemStackEnchantments;
        }
        return this.itemStack;
    }
}
