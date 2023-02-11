import { world } from "@minecraft/server";
import { Ban } from "../Anti-Cheat/modules/models/Ban";
import { GLOBAL_BAN_LIST } from "./list";

world.events.playerJoin.subscribe(({playerName}) => {
  if (!GLOBAL_BAN_LIST.includes(playerName)) return;
  new Ban(playerName, null, "Global Ban List");
});
