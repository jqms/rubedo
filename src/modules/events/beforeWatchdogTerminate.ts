import { system } from "mojang-minecraft";

system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;
  console.warn(`WATCHDOG TRIED TO CRASH = ${data.terminateReason}`);
});
