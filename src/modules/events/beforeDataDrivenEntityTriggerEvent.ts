import { Player, world } from "mojang-minecraft";
import { TABLES } from "../../lib/Database/tables";
import { getId } from "../../utils";

let e = world.events.beforeDataDrivenEntityTriggerEvent.subscribe((data) => {
  if (world.getDynamicProperty("roleHasBeenSet"))
    return world.events.beforeDataDrivenEntityTriggerEvent.unsubscribe(e);
  if (!(data.entity instanceof Player)) return;
  if (data.id != "rubedo:becomeAdmin") return;
  data.entity.setDynamicProperty("role", "admin");
  TABLES.roles.set(data.entity.name, "admin");
  world.setDynamicProperty("roleHasBeenSet", true);
  world.setDynamicProperty("worldsOwner", getId(data.entity));
  data.entity.tell(
    `§l§cYou have been given admin, the function start will not work anymore!!!!`
  );
});
