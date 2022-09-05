import { world } from "mojang-minecraft";
import { SA } from "../../../../index.js";
import { Ban } from "../Models/Ban";
import { PlayerLog } from "../Models/PlayerLog";

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
  const value = (log.get(data.entity) ?? 0) + 1;
  log.set(data.entity, value);
  if (value <= KILLAURA_KICK_NUMBER) return;
  new Ban(data.entity, null, null, "Kill aura");
});

SA.Utilities.time.setTickInterval(() => {
  log.clear();
}, 20);
