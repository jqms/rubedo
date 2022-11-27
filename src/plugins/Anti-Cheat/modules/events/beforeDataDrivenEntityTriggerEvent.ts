import { Player, world } from "@minecraft/server";
import { setRole } from "../../utils";

let e = world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
  if (world.getDynamicProperty("roleHasBeenSet"))
    return world.events.beforeDataDrivenEntityTriggerEvent.unsubscribe(e);
  if (!(data.entity instanceof Player)) return;
  if (data.id != "rubedo:becomeAdmin") return;
  setRole(data.entity, "admin");
  world.setDynamicProperty("roleHasBeenSet", true);
  world.setDynamicProperty("worldsOwner", data.entity.id);
  data.entity.tell(
    `§l§cYou have been given admin, the function start will not work anymore!!!!`
  );
});
