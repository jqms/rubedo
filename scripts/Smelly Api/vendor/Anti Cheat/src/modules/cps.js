import { world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { PlayerLog } from "../Models/PlayerLog";
import { kick } from "../utils.js";

/**
 * The log of the players hit times
 */
const currentCps = new PlayerLog();

/**
 * The max cps a player could ever have before there hacking or using autoclicker
 */
const MAX_PLAYER_CPS = 15;

world.events.entityHit.subscribe((data) => {
  /**
   * The old number of hits per seconds
   */
  const value = currentCps.get(data.entity) ?? 0;
  currentCps.set(data.entity, value + 1);
  if (value + 1 > MAX_PLAYER_CPS)
    kick(data.entity, [`§aReason: §fCPS too high: ${value + 1}`]);
});

SA.Utilities.time.setTickInterval(() => {
  currentCps.clear();
}, 20);
