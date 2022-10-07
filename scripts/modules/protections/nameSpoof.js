import { world } from "mojang-minecraft";
import { kick } from "../../utils";
const VAILD_GAMERTAG = /^([\p{L}])([\p{L}\d\s#'()-_]{1,20})([\p{L}\d\)])$/isu;
const TOOLBOX_NAME = `§c§k§m§A§r§cToolbox Gamer§k§mA§r`;
world.events.playerJoin.subscribe(({ player }) => {
    const gamertag = player.name;
    const fail = () => kick(player, [
        `§cYou have been kicked!`,
        `§aReason: §f'${gamertag}' is Invalid`,
        `§fThis Server requires you to have a valid gamertag!`,
    ]);
    if (gamertag == TOOLBOX_NAME)
        return fail();
    if (!VAILD_GAMERTAG.test(gamertag))
        return fail();
    if ([...world.getPlayers()].filter((p) => p.name == player.name).length > 1)
        return fail();
});
