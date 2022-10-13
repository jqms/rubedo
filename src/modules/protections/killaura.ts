import { Player, world } from "mojang-minecraft";
import { setTickInterval } from "../../lib/Scheduling/utils.js";
import { Ban } from "../models/Ban";
import { PlayerLog } from "../models/PlayerLog";

/**
 * Logs how many times this player has got kill aura acused
 * resets every second
 */
const log = new PlayerLog();

/**
 * The amount of times this player can be loged before kicking
 */
const KILLAURA_KICK_NUMBER = 10;

world.events.entityHit.subscribe((data) => {
  if (data.entity.getEntitiesFromViewVector()[0] == data.hitEntity) return;
  // Kill aura!
  const value = (log.get(data.entity as Player) ?? 0) + 1;
  log.set(data.entity as Player, value);
  if (value <= KILLAURA_KICK_NUMBER) return;
  new Ban(data.entity as Player, null, null, "Kill aura");
});

setTickInterval(() => {
  log.clear();
}, 20);
