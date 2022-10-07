import { world } from "mojang-minecraft";
import { Mute } from "../models/Mute";
const OVERWORLD = world.getDimension("overworld");
world.events.playerJoin.subscribe(({ player }) => {
    let e = world.events.tick.subscribe((data) => {
        try {
            OVERWORLD.runCommand(`testfor @a[name="${player.name}"]`);
            world.events.tick.unsubscribe(e);
            if (Mute.getMuteData(player))
                player.runCommand(`ability @s mute true`);
        }
        catch (error) { }
    });
});
