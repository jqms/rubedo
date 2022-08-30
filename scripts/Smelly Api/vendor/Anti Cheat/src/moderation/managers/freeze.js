import { Location, world } from "mojang-minecraft";
import { SA } from "../../../../../index.js";
import { db_freezes } from "../../index.js";
import { forEachValidPlayer } from "../../utils.js";

forEachValidPlayer((player) => {
  const freezeData = db_freezes.get(SA.Models.entity.getId(player));
  if (!freezeData) return;
  player.teleport(
    new Location(
      freezeData.location.x,
      freezeData.location.y,
      freezeData.location.z
    ),
    world.getDimension(freezeData.location.dimension),
    0,
    0
  );
}, 20);
