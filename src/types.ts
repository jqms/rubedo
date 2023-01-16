import { ItemStack, Player } from "@minecraft/server";
import { Container } from "./rubedo/lib/Containers/Container";
import type { ROLES } from "./vendor/Anti-Cheat/types";

export interface IMsOptions {
  compactDuration?: string;
  fullDuration?: string;
  avoidDuration?: Array<string>;
}

export interface IplayerTickRegister {
  /**
   * callback to send
   */
  callback: (player: Player) => void;
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
  [key: string]: Container;
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

export type durationSegmentType = "y" | "w" | "d" | "h" | "m" | "s" | "ms";
export type durationSegment = `${number}${durationSegmentType}`;
