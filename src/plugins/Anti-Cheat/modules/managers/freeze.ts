import { Location } from "@minecraft/server";
import { TABLES } from "../../../../lib/Database/tables.js";
import { DIMENSIONS } from "../../../../utils.js";
import { forEachValidPlayer } from "../../utils.js";

forEachValidPlayer((player) => {
  const freezeData = TABLES.freezes.get(player.id);
  if (!freezeData) return;
  player.teleport(
    new Location(
      freezeData.location.x,
      freezeData.location.y,
      freezeData.location.z
    ),
    DIMENSIONS[freezeData.location.dimension as keyof typeof DIMENSIONS],
    0,
    0
  );
}, 20);
