import { world } from "mojang-minecraft";
import { DIMENSIONS } from "../../utils";
import { Mute } from "../models/Mute";
import { ChangePlayerRoleTask } from "../models/Task";

world.events.playerJoin.subscribe(({ player }) => {
  let e = world.events.tick.subscribe((data) => {
    try {
      DIMENSIONS.overworld.runCommand(`testfor @a[name="${player.name}"]`);
      world.events.tick.unsubscribe(e);
      if (Mute.getMuteData(player)) player.runCommand(`ability @s mute true`);
      /**
       * This is a role that was tried to push when the player was offline
       * so were setting it now because the player just joined
       */
      const roleToSet = ChangePlayerRoleTask.getPlayersRoleToSet(player.name);
      if (roleToSet) player.setDynamicProperty("role", roleToSet);
    } catch (error) {}
  });
});
