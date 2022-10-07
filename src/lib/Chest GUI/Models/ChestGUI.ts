import { Entity, Events, ItemStack, Player, world } from "mojang-minecraft";
import { getItemUid, ISlot, Page } from "./Page.js";
import {
  DEFAULT_STATIC_PAGE_ID,
  ENTITY_INVENTORY,
} from "../../../config/chest.js";
import { ItemGrabbedCallback } from "./ItemGrabbedCallback.js";
import { clearPlayersPointer, getEntitys, getItemAtSlot } from "../utils.js";
import { text } from "../../../lang/text.js";
import { PAGES } from "../pages.js";

export interface ISlotChangeReturn {
  /**
   * Slot that changed
   */
  slot: number;
  /**
   * the item that was grabbed / put
   */
  item: ItemStack;
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

interface ICurrentGUIS {
  [key: string]: ChestGUI;
}

interface IEvents {
  [key: string]: any;
}

/**
 * This is a object showing players chestGUI to entity
 */
export const CURRENT_GUIS: ICurrentGUIS = {};

export class ChestGUI {
  player: Player;
  playersName: string;
  entity: Entity;
  previousMap: Array<IMappedInventoryItem>;
  /**
   * If the player has a container open menaing this is open
   */
  HAS_CONTAINER_OPEN: boolean;
  pageHistory: Array<string>;
  /**
   * Random data that can be passed to a fillType
   */
  extras: Object;
  page: Page;
  loops: Array<Function>;
  events: IEvents;

  /**
   * Gets a inventory's coresponding gui
   */
  static getEntitysGuiInstance(entity: Entity | null) {
    return Object.values(CURRENT_GUIS).find((gui) => gui.entity == entity);
  }
  /**
   * Finds and returns a slot change in a inventory
   * @returns {SlotChangeReturn | null}
   */
  static getSlotChange(
    oldInv: Array<IMappedInventoryItem>,
    newInv: Array<IMappedInventoryItem>
  ): ISlotChangeReturn | null {
    if (oldInv.length != newInv.length) return null;
    for (let i = 0; i < oldInv.length; i++) {
      if (oldInv[i].uid != newInv[i].uid)
        return { slot: i, item: oldInv[i].item };
    }
    return null;
  }

  /**
   * Creates a new chestGUI and assigns it to a player
   * @param player the player this chestGUI is asigned to
   * @param entity entity to use if undefined will create one
   */
  constructor(player: Player, entity?: Entity) {
    this.player = player;
    this.playersName = player.name;
    this.entity = entity;
    this.previousMap = null;
    this.HAS_CONTAINER_OPEN = false;
    this.pageHistory = [];
    this.extras = null;
    this.page = null;
    this.loops = [];
    if (!this.entity) this.summon();

    this.events = {
      tick: world.events.tick.subscribe(() => {
        try {
          if (!this.HAS_CONTAINER_OPEN) return;
          if (!this.previousMap) return;
          /**
           * Runs each Loop Callback fot this current page
           */
          for (const loop of this.loops) {
            loop();
          }
          /**
           * Trys to find a change in the page
           */
          const change: ISlotChangeReturn | null = ChestGUI.getSlotChange(
            this.previousMap,
            this.mapInventory
          );
          if (change == null) return;
          this.onSlotChange(change);
        } catch (error) {
          console.warn(error + error.stack);
        }
      }),
      playerLeave: world.events.playerLeave.subscribe(({ playerName }) => {
        if (playerName != this.playersName) return;
        this.kill();
      }),
      beforeDataDrivenEntityTriggerEvent:
        world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
          if (
            ![
              "rubedo:has_container_open",
              "rubedo:dosent_have_container_open",
            ].includes(data.id)
          )
            return;
          if (data.entity.nameTag != this.player.nameTag) return;
          if (data.id == "rubedo:has_container_open")
            return (this.HAS_CONTAINER_OPEN = true);
          this.HAS_CONTAINER_OPEN = false;
        }),
    };

    CURRENT_GUIS[this.playersName] = this;
  }

  /**
   * This spawns a chest GUI entity and sets the this.entity
   */
  summon() {
    try {
      getEntitys(ENTITY_INVENTORY)
        ?.find((e) => e.getTags().includes(`id:${this.playersName}`))
        ?.triggerEvent("despawn");
      let e = world.events.entityCreate.subscribe((data) => {
        if (data.entity?.id == ENTITY_INVENTORY) {
          this.entity = data.entity;
          this.entity.addTag(`id:${this.playersName}`);
          this.setPage(DEFAULT_STATIC_PAGE_ID);
        }
        world.events.entityCreate.unsubscribe(e);
      });
      this.player.triggerEvent("rubedo:spawn_inventory");
    } catch (error) {
      console.warn(error + error.stack);
    }
  }

  /**
   * Reloads this chect GUI
   */
  reload() {
    this.entity.triggerEvent("despawn");
    this.summon();
  }

  /**
   * Kills this chestGUI and removes all events
   */
  kill() {
    try {
      this.entity?.triggerEvent("despawn");
    } catch (error) {}
    for (const key in this.events) {
      world.events[key as keyof Events].unsubscribe(this.events[key]);
    }
    delete CURRENT_GUIS[this.playersName];
  }

  /**
   * Sets a container to specific page
   * @param id page number its the index of const PAGES
   * @param extras stuff that needs to be passed into this page
   */
  setPage(id: string, extras?: any) {
    /**
     * Stores the current extras for this page
     */
    this.extras = extras;
    /**
     * Adds this page to the page history
     */
    this.pageHistory.push(id);
    /**
     * Resets loops because page changed
     */
    this.loops = [];
    const page = PAGES[id];
    if (!page)
      return new Error(
        text["api.ChestGUI.error.pagenotfound"](id ?? "Undefined")
      );
    page.fillType(this.entity, page, extras);

    this.page = page;
    this.previousMap = this.mapInventory;
    this.entity.nameTag = `size:${page.size}` ?? "size:27";
    // entity.triggerEvent(`size:${page.size}`);
  }

  /**
   * Gets a entitys inventory but with mapped data
   */
  get mapInventory(): Array<IMappedInventoryItem> {
    let container = this.entity.getComponent("inventory").container;
    let inventory = [];

    for (let i = 0; i < container.size; i++) {
      let currentItem = container.getItem(i);

      inventory.push({
        uid: getItemUid(currentItem),
        item: currentItem,
      });
    }

    this.previousMap = inventory;
    return inventory;
  }

  /**
   * This runs when a slot gets changed in the chest inventory
   */
  onSlotChange(change: ISlotChangeReturn) {
    /**
     * The guiItem that was changed
     */
    const slot: ISlot = this.page.slots[change.slot];

    if (!slot) {
      // item was added to page that is not a valid slot so set that slot back to air
      this.entity.runCommand(
        `replaceitem entity @s slot.inventory ${change.slot} air`
      );
    } else {
      // item was taken from this page
      if (slot.item) clearPlayersPointer(this.player, slot.item);
      /**
       * if the slot has a item that returns when something is grabbed, this checks
       * if there is a item put into the slot to return, if not it will not send a
       * callback by returning before
       */
      if (!slot.item && !getItemAtSlot(this.entity, change.slot)) return;
      this.runItemAction(slot, change);
    }

    this.previousMap = this.mapInventory;
  }

  /**
   * Runs a item action when its grabbed out of a container
   */
  runItemAction(slot: ISlot, change: ISlotChangeReturn) {
    if (!slot.action) return;
    slot.action(new ItemGrabbedCallback(this, slot, change));
  }

  /**
   * Registers a Loop to run every tick while the current page is still showing
   */
  registerLoop(callback: Function) {
    this.loops.push(callback);
  }
}
