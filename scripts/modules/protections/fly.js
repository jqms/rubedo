import { PlayerLog } from "../models/PlayerLog.js";
import { forEachValidPlayer } from "../../utils";
import { PreviousLocation as PrevLo } from "../models/PreviousLocation.js";
export const log = new PlayerLog();
const FLYING_VELOCITY = 0.9;
const FLY_TIME = 20;
const DAMAGE = true;
const TAGS = ["gliding", "riding", "levitating", "swimming"];
function getHeldItem(player) {
    const inventory = player.getComponent("minecraft:inventory").container;
    return inventory.getItem(player.selectedSlot);
}
forEachValidPlayer((player, { currentTick }) => {
    if (player.getTags().some((tag) => TAGS.includes(tag)))
        return;
    const get = () => log.get(player) ?? new PrevLo(player, currentTick, log);
    const velocity = Math.sqrt(player.velocity.x ** 2 + player.velocity.z ** 2);
    if (player.hasTag("on_ground"))
        return get().update();
    if (velocity < FLYING_VELOCITY)
        return;
    if (getHeldItem(player)?.id == "minecraft:trident")
        return;
    if (currentTick - get().tick < FLY_TIME)
        return;
    get().back();
    if (DAMAGE) {
        try {
            player.runCommand(`damage @s 4 fly_into_wall`);
        }
        catch (error) { }
    }
}, 20);
