import { Ban } from "../models/Ban.js";
import { forEachValidPlayer } from "../../utils";
const DISTANCE = 100000;
forEachValidPlayer((player) => {
    if (Math.abs(player.location.x) > DISTANCE ||
        Math.abs(player.location.y) > DISTANCE ||
        Math.abs(player.location.z) > DISTANCE) {
        new Ban(player, null, null, "Hacking: Crasher");
    }
});
