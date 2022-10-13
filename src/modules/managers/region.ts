import { BlockLocation, Player, world } from "mojang-minecraft";
import { Region } from "../models/Region.js";
import { forEachValidPlayer, getRole, loadRegionDenys } from "../../utils.js";
import { setTickInterval } from "../../lib/Scheduling/utils.js";
import { BLOCK_CONTAINERS, DOORS_SWITCHES } from "../../config/region.js";

/**
 * Sets Deny blocks at bottom of region every 5 mins
 */
setTickInterval(() => {
  loadRegionDenys();
}, 6000);

/**
 * Permissions for region
 */
world.events.beforeItemUseOn.subscribe((data) => {
  if (["moderator", "admin"].includes(getRole(data.source as Player))) return;
  const region = Region.blockLocationInRegion(
    data.blockLocation,
    data.source.dimension.id
  );
  if (!region) return;
  const block = data.source.dimension.getBlock(data.blockLocation);
  if (DOORS_SWITCHES.includes(block.id) && region.permissions.doorsAndSwitches)
    return;
  if (BLOCK_CONTAINERS.includes(block.id) && region.permissions.openContainers)
    return;
  data.cancel = true;
});

world.events.beforeExplosion.subscribe((data) => {
  for (let i = 0; i < data.impactedBlocks.length; i++) {
    const bL = data.impactedBlocks[i];
    let region = Region.blockLocationInRegion(bL, data.dimension.id);
    if (region) return (data.cancel = true);
  }
});

world.events.entityCreate.subscribe((data) => {
  const region = Region.blockLocationInRegion(
    new BlockLocation(
      data.entity.location.x,
      data.entity.location.y,
      data.entity.location.z
    ),
    data.entity.dimension.id
  );
  if (!region) return;
  if (region.permissions.allowedEntitys.includes(data.entity.id)) return;
  data.entity.teleport({ x: 0, y: -64, z: 0 }, data.entity.dimension, 0, 0);
  data.entity.kill();
});

setTickInterval(() => {
  for (const region of Region.getAllRegions()) {
    for (const entity of world
      .getDimension(region.dimensionId)
      .getEntities({ excludeTypes: region.permissions.allowedEntitys })) {
      if (!region.entityInRegion(entity)) continue;
      entity.teleport({ x: 0, y: -64, z: 0 }, entity.dimension, 0, 0);
      entity.kill();
    }
  }
}, 100);

/**
 * Gives player a tag if they are in a region
 */
forEachValidPlayer((player) => {
  for (const region of Region.getAllRegions()) {
    if (region.entityInRegion(player)) {
      player.addTag(`inRegion`);
      if (!region.permissions.pvp) player.addTag(`region-protected`);
    } else {
      player.removeTag(`inRegion`);
      player.removeTag(`region-protected`);
    }
  }
}, 5);
