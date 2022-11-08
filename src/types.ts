import { ItemStack, Player, TickEvent } from "@minecraft/server";
import type { BlockInventory } from "./modules/models/BlockInventory";

/**
 * The roles that are in this server
 */
export enum ROLES {
  member,
  admin,
  moderator,
  builder,
}

export interface IMsOptions {
  compactDuration?: string;
  fullDuration?: string;
  avoidDuration?: Array<string>;
}

export interface IplayerTickRegister {
  /**
   * callback to send
   */
  callback: (player: Player, event: TickEvent) => void;
  /**
   * delay in ticks
   */
  delay: number;
  /**
   * the last tick it sent a callback
   */
  lastCall: number;
}

export interface ISlotChangeReturn {
  /**
   * Slot that changed
   */
  slot: number;
  /**
   * the item that was grabbed / put
   */
  item: ItemStack;
}

export interface IEvents {
  [key: string]: any;
}

export interface IContainerLocation {
  [key: string]: BlockInventory;
}

export interface IBanData {
  key: string;
  playerName: string;
  date: number;
  duration: number;
  expire: number | null;
  reason: string;
  by: string;
}

export interface IFreezeData {
  player: string;
  key: string;
  reason: string;
  location: {
    x: number;
    y: number;
    z: number;
    dimension: string;
  };
}

export interface IMuteData {
  player: string;
  date: number;
  duration: number | null;
  expire: number | null;
  reason: string;
  by: string;
}

export interface INpcLocation {
  dimension: string;
  x: number;
  y: number;
  z: number;
}

export interface IRegionDB {
  dimensionId: string;
  from: IRegionCords;
  to: IRegionCords;
  key: string;
  permissions: IRegionPermissions;
}

export interface IRegionCords {
  x: number;
  z: number;
}

export interface IRegionPermissions {
  /**
   * if the player can use chests, defualt: true
   */
  doorsAndSwitches: Boolean;
  /**
   * if the player can use doors, default: true
   */
  openContainers: Boolean;
  /**
   * if players can fight, default: false
   */
  pvp: Boolean;
  /**
   * the entitys allowed in this region
   */
  allowedEntitys: Array<string>;
}

export interface IChangePlayerRoleData {
  /**
   * The name of the player
   */
  playerName: string;
  /**
   * The role that the player should be set to
   */
  role: keyof typeof ROLES;
}

export type durtationSegmentType = "y" | "w" | "d" | "h" | "m" | "s" | "ms";
export type durationSegment = `${number}${durtationSegmentType}`;
