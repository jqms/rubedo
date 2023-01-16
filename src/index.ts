import { system } from "@minecraft/server";
import "./rubedo/lib/Command/index";
import "./rubedo/lib/Chest GUI/index";
import "./rubedo/database/index";
import "./rubedo/lib/Containers/index";
import "./vendor/import";

system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;
  console.warn(`WATCHDOG TRIED TO CRASH = ${data.terminateReason}`);
});
