import { Player, system, world } from "@minecraft/server";
import { EntitiesLoad } from "./EntitiesLoad";

const CALLBACKS: {
  [key: number]: {
    callback: (player: Player) => void;
    delay: number;
    lastCall: number;
  };
} = {};

EntitiesLoad.subscribe(() => {
  system.runSchedule(() => {
    const players = [...world.getPlayers()];
    for (const [i, player] of players.entries()) {
      for (const CALLBACK of Object.values(CALLBACKS)) {
        if (
          CALLBACK.delay != 0 &&
          system.currentTick - CALLBACK.lastCall < CALLBACK.delay
        )
          continue;
        CALLBACK.callback(player);
        if (i == players.length - 1) CALLBACK.lastCall = system.currentTick;
      }
    }
  });
});

export class forEachPlayer {
  /**
   * Subscribes to a callback that returns every player
   * @param callback what to be called for each player
   * @returns the id that is used to unsubscribe
   */
  static subscribe(
    callback: (player: Player) => void,
    delay: number = 0
  ): number {
    const key = Object.keys(CALLBACKS).length;
    CALLBACKS[key] = { callback: callback, delay: delay, lastCall: 0 };
    return key;
  }
  static unsubscribe(key: number): void {
    delete CALLBACKS[key];
  }
}
