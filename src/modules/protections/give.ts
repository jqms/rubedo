import {
  ItemStack,
  MinecraftItemTypes,
  Player,
  world,
} from "@minecraft/server";
import {
  getItemUid,
  onEntityInventorySlotChange,
  PREVIOUS_CHANGE,
} from "../../lib/Events/onSlotChange";
import { forEachValidPlayer } from "../../utils";
import { PlayerLog } from "../models/PlayerLog";

/**
 * Since this anti give isnt 100% these are the only items this anti cheat
 * will clear because there allowed but they usally modded
 */
const DETECTABLE_ITEMS = [
  "minecraft:shulker_box",
  "minecraft:undyed_shulker_box",
  "minecraft:chest",
  "minecraft:barrel",
];

/**
 * Stores all possible items this player can get
 * @key is equal to the player
 * @value the uids of the possible items this player can grab
 */
const POSSIBLE_ITEMS = new PlayerLog<Array<string>>();

/**
 * Gets all possible items around a player, it looks for entitys
 * that are horses
 * @param player player to get from
 */
function getPossibleItems(player: Player): void {
  let possibleItems: string[] = [];
  for (const entity of player.dimension.getEntities({
    maxDistance: 5,
    location: player.location,
  })) {
    if (entity.typeId == "minecraft:item") {
      let uid = getItemUid(entity.getComponent("item").itemStack);
      if (!possibleItems.includes(uid)) possibleItems.push(uid);
    }
    if (entity.getComponent("inventory")?.containerType != "horse") continue;
    const inventory = entity.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
      const item = inventory.getItem(i);
      if (!item) continue;
      let uid = getItemUid(item);
      if (!possibleItems.includes(uid)) possibleItems.push(uid);
    }
  }
  POSSIBLE_ITEMS.set(player, possibleItems);
}

world.events.entityCreate.subscribe((data) => {
  if (data.entity.typeId != "minecraft:item") return;
  for (const player of data.entity.dimension.getEntities({
    maxDistance: 5,
    type: "minecraft:player",
    location: data.entity.location,
  })) {
    if (!(player instanceof Player)) continue;
    let possibleItems = POSSIBLE_ITEMS.get(player) ?? [];
    possibleItems.push(getItemUid(data.entity.getComponent("item").itemStack));
    POSSIBLE_ITEMS.set(player, possibleItems);
  }
});

forEachValidPlayer((player) => {
  getPossibleItems(player);
}, 20);

onEntityInventorySlotChange.subscribe(
  { type: "minecraft:player" },
  (player, change) => {
    console.warn(change.changeType);
    if (!(player instanceof Player)) return;
    if (change.changeType != "put") return;
    if ((POSSIBLE_ITEMS.get(player) ?? []).includes(change.uid))
      return getPossibleItems(player);
    POSSIBLE_ITEMS.set(player, []);
    console.warn(change.item.typeId);
    if (!DETECTABLE_ITEMS.includes(change.item.typeId))
      return console.warn(`item is not valid`);
    if (player.hasTag("has_container_open"))
      return console.warn(`player is in a contaier`);
    console.warn(`give detected`);
    player
      .getComponent("inventory")
      .container.setItem(0, new ItemStack(MinecraftItemTypes.stick, 0));
    delete PREVIOUS_CHANGE[player.id];
  }
);
