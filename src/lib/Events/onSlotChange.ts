import {
  ItemStack,
  Player,
  PlayerInventoryComponentContainer,
  world,
} from "mojang-minecraft";
import { PlayerLog } from "../../modules/models/PlayerLog";
import { setTickInterval } from "../Scheduling/utils";

type onSlotChangeCallback = (player: Player, change: ISlotChangeReturn) => void;

const CALLBACKS: {
  [key: number]: onSlotChangeCallback;
} = {};

const MAPPED_INVENTORYS = new PlayerLog<Array<IMappedInventoryItem>>();

export interface ISlotChangeReturn {
  /**
   * Slot that changed
   */
  slot: number;
  /**
   * The uid of this item
   */
  uid: string;
  /**
   * The old uid of this item
   */
  oldUid?: string;
  /**
   * the item that was grabbed / put
   */
  item: ItemStack;
  /**
   * The old itemStack that was in this slot
   */
  oldItem?: ItemStack;
  /**
   * How the inventory has changed
   */
  moveType: "delete" | "put" | "swap" | "fluctuation";
}

interface IMappedInventoryItem {
  /**
   * a unique id for a itemStack
   */
  uid: string;
  /**
   * the item
   */
  item: ItemStack;
}

/**
 * Finds and returns a slot change in a inventory
 */
function getSlotChanges(
  oldInv: Array<IMappedInventoryItem>,
  newInv: Array<IMappedInventoryItem>
): Array<ISlotChangeReturn> {
  if (oldInv.length != newInv.length) return [];
  const changes: Array<ISlotChangeReturn> = [];
  for (let i = 0; i < newInv.length; i++) {
    if (
      oldInv[i]?.item?.amount < newInv[i]?.item?.amount ||
      (oldInv[i]?.item?.amount > newInv[i]?.item?.amount &&
        oldInv[i]?.item?.amount != 0)
    ) {
      changes.push({
        slot: i,
        uid: newInv[i].uid,
        oldUid: oldInv[i].uid,
        item: newInv[i].item,
        oldItem: oldInv[i].item,
        moveType: "fluctuation",
      });
      continue;
    }
    if (newInv[i].uid == oldInv[i].uid) continue;
    if (oldInv[i]?.item && newInv[i]?.item) {
      changes.push({
        slot: i,
        uid: newInv[i].uid,
        oldUid: oldInv[i].uid,
        item: newInv[i].item,
        oldItem: oldInv[i].item,
        moveType: "swap",
      });
    } else if (!newInv[i]?.item) {
      changes.push({
        slot: i,
        uid: oldInv[i].uid,
        item: oldInv[i].item,
        moveType: "delete",
      });
    } else if (newInv[i]?.item) {
      changes.push({
        slot: i,
        uid: newInv[i].uid,
        item: newInv[i].item,
        moveType: "put",
      });
    }
  }
  return changes;
}

/**
  * Converts a itemStack to a unique id
  * @param {ItemStack} item
  * @returns {string}
 
  */
function getItemUid(item: ItemStack): string {
  if (!item) return "";
  const data = [];
  data.push(item.id);
  data.push(item.nameTag);
  data.push(item.data);
  data.push(item.getLore());
  return data.join("");
}

/**
 * Gets a entitys inventory but with mapped data
 */
function mapInventory(
  container: PlayerInventoryComponentContainer
): Array<IMappedInventoryItem> {
  const inventory = [];

  for (let i = 0; i < container.size; i++) {
    let item = container.getItem(i);
    inventory[i] = {
      uid: getItemUid(item),
      item: item,
    };
  }
  return inventory;
}

setTickInterval(() => {
  for (const player of world.getPlayers()) {
    const inventory = mapInventory(player.getComponent("inventory").container);
    const changes = getSlotChanges(
      MAPPED_INVENTORYS.get(player) ?? inventory,
      inventory
    );
    MAPPED_INVENTORYS.set(player, inventory);
    if (changes.length == 0) continue;
    for (const change of changes) {
      for (const callback of Object.values(CALLBACKS)) {
        callback(player, change);
      }
    }
  }
}, 5);

export class onSlotChange {
  static subscribe(callback: onSlotChangeCallback): number {
    const key = Date.now();
    CALLBACKS[key] = callback;
    return key;
  }
  static unsubscribe(key: number): void {
    delete CALLBACKS[key];
  }
}
