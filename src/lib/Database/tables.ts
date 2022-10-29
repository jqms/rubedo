import type {
  IRegionDB,
  IMuteData,
  IBanData,
  IFreezeData,
  INpcLocation,
} from "../../types";
import type { ROLES } from "../../types";
import { Database } from "../../lib/Database/Database";

/**
 * All the Database tables that are created
 */
export const TABLES = {
  config: new Database<any>("config"),
  freezes: new Database<IFreezeData>("freezes"),
  mutes: new Database<IMuteData>("mutes"),
  bans: new Database<IBanData>("bans"),
  regions: new Database<IRegionDB>("regions"),
  roles: new Database<keyof typeof ROLES>("roles"),
  tasks: new Database<any>("tasks"),
  npcs: new Database<INpcLocation>("npcs"),
  ids: new Database<string>("ids"),
};
