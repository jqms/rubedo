import { GameMode, world } from "@minecraft/server";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";
import { Protection } from "../models/Protection.js";
import { PlayerLog } from "../models/PlayerLog.js";

/**
 * The gamemode that you cannot be in unless you have staff tag
 */
const ILLEGAL_GAMEMODE = GameMode.creative;

/**
 * Stores per world load violation data for players
 */
const ViolationCount = new PlayerLog<number>();

const protection = new Protection<{
  clearPlayer: boolean;
  setToSurvival: boolean;
  banPlayer: boolean;
  violationCount: number;
}>(
  "gamemode",
  "Blocks illegal gamemode",
  "textures/ui/creative_icon.png"
).setConfigDefault({
  clearPlayer: {
    description: "Whether to clear players inventory.",
    defaultValue: true,
  },
  setToSurvival: {
    description: "If player should be set to survival after being flagged.",
    defaultValue: true,
  },
  banPlayer: {
    description: "If player should be banned after violation count is met.",
    defaultValue: false,
  },
  violationCount: {
    description: "The amount of violations before ban.",
    defaultValue: 0,
  },
});

protection.runSchedule(async () => {
  const config = await protection.getConfigSync();
  for (const player of world.getPlayers({ gameMode: ILLEGAL_GAMEMODE })) {
    if (["moderator", "admin", "builder"].includes(getRole(player))) continue;
    try {
      if (config.setToSurvival) player.runCommandAsync(`gamemode s`);
      if (config.clearPlayer) player.runCommandAsync(`clear @s`);
    } catch (error) {}
    const count = (ViolationCount.get(player) ?? 0) + 1;
    ViolationCount.set(player, count);
    if (config.banPlayer && count >= config.violationCount)
      new Ban(player, null, "Illegal Gamemode");
  }
}, 20);

protection.enable();
