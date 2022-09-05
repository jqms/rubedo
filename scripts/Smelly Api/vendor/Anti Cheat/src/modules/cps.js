import { world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { PlayerLog } from "../Models/PlayerLog";
import { kick } from "../utils.js";

/**
 * The log of the players hit times
 * resets every seconds
 */
export const CURRENT_CPS = new PlayerLog();

/**
 * The max cps a player could ever have before there hacking or using autoclicker
 */
const MAX_PLAYER_CPS = 15;

world.events.entityHit.subscribe((data) => {
  /**
   * The old number of hits per seconds
   */
  const value = (CURRENT_CPS.get(data.entity) ?? 0) + 1;
  CURRENT_CPS.set(data.entity, value);
  if (value > 10)
    SA.Providers.chat.broadcast(
      `You are clicking to fast! Please click slower!`,
      data.entity.nameTag
    );
  if (value > MAX_PLAYER_CPS)
    kick(data.entity, [`§aReason: §fCPS too high: ${value + 1}`]);
});

SA.Utilities.time.setTickInterval(() => {
  CURRENT_CPS.clear();
}, 20);
