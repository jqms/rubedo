import { Database } from "../../lib/Database/Database";
export const TABLES = {
    config: new Database("config"),
    freezes: new Database("freezes"),
    mutes: new Database("mutes"),
    bans: new Database("bans"),
    regions: new Database("regions"),
    roles: new Database("roles"),
    tasks: new Database("tasks"),
    npcs: new Database("npcs"),
};
