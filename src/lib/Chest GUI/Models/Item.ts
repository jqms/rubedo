import {
  Enchantment,
  EnchantmentList,
  Items,
  ItemStack,
  MinecraftEnchantmentTypes,
} from "mojang-minecraft";

/**
 * @typedef {Object} ItemComponents the components on a item
 * @property {String} nameTag the nametag of the item
 * @property {String[]} lore The lore of the item
 * @property {Enchantment[]} enchantments The lore of the item
 * @property {String} dbKey the db key of this itemStack
 */

interface IItemComponents {
  /**
   * the nametag of the item
   */
  nameTag?: string;
  /**
   * The lore of the item
   */
  lore?: string[];
  /**
   * The enchantments on this item
   */
  enchantments?: Enchantment[];
  /**
   * the db key of this itemStack
   */
  dbKey?: string;
}

export class Item {
  id: string;
  amount: number;
  data: number;
  components: IItemComponents;
  itemStack?: ItemStack;
  /**
   * Converts a itemStack to a Item
   * @param item
   * @param extras extra info to store on the item
   */
  static itemStackToItem(item: ItemStack, extras: Object = {}) {
    const enchantments: EnchantmentList =
      item.getComponent("enchantments").enchantments;
    const ItemStackEnchantments: Array<Enchantment> = [];
    for (const Enchantment in MinecraftEnchantmentTypes) {
      const ItemEnchantment = enchantments.getEnchantment(
        MinecraftEnchantmentTypes[
          Enchantment as keyof MinecraftEnchantmentTypes
        ]
      );
      if (!ItemEnchantment) continue;
      ItemStackEnchantments.push(
        MinecraftEnchantmentTypes[
          Enchantment as keyof MinecraftEnchantmentTypes
        ]
      );
    }
    return new Item(item.id, item.amount, item.data, {
      nameTag: item.nameTag,
      lore: item.getLore(),
      enchantments: ItemStackEnchantments,
    });
  }

  /**
   * Creates a new Item used for chest GUI
   * @param {String} id the item id of the item
   * @param {Number} amount the amount of this item
   * @param {Number} data the data value of this item
   * @param {ItemComponents} components the items components
   * @param {ItemStack} itemStack this itemStack
   */
  constructor(
    id: string,
    amount: number = 1,
    data: number = 0,
    components: IItemComponents = {},
    itemStack?: ItemStack
  ) {
    this.id = id;
    this.amount = amount;
    this.data = data;
    this.components = components;

    this.itemStack = itemStack
      ? itemStack
      : new ItemStack(Items.get(this.id), amount, data);
  }

  /**
   * Sets a components to this item
   */
  setComponents(components: IItemComponents = this.components): ItemStack {
    this.components = components;
    if (components?.nameTag) this.itemStack.nameTag = components.nameTag;
    if (this.components?.lore) this.itemStack.setLore(this.components.lore);
    if (components?.enchantments?.length > 0) {
      const ItemStackEnchantments: EnchantmentList =
        this.itemStack.getComponent("enchantments").enchantments;
      for (const ench of components.enchantments) {
        ItemStackEnchantments.addEnchantment(ench);
      }
      this.itemStack.getComponent("enchantments").enchantments =
        ItemStackEnchantments;
    }
    return this.itemStack;
  }
}
