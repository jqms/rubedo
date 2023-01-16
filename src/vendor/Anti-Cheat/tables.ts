import { Database } from "../../rubedo/database/Database";
import {
  IBanData,
  IFreezeData,
  IMuteData,
  INpcLocation,
  IProtectionsConfig,
  IRegionDB,
  LogData,
  ROLES,
} from "./types";

export const TABLES = {
  config: new Database<string, any>("config"),
  freezes: new Database<string, IFreezeData>("freezes"),
  mutes: new Database<string, IMuteData>("mutes"),
  bans: new Database<string, IBanData>("bans"),
  regions: new Database<string, IRegionDB>("regions"),
  roles: new Database<string, keyof typeof ROLES>("roles"),
  tasks: new Database<string, any>("tasks"),
  npcs: new Database<string, INpcLocation>("npcs"),
  ids: new Database<string, string>("ids"),
  logs: new Database<string, LogData>("logs"),
  protections: new Database<string, IProtectionsConfig>("protections"),
};
