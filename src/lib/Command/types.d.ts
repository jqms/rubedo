import type { ROLES } from "../../types";
import { Command } from "./Command";

export interface ICommandData {
  /**
   * The name of the command
   */
  name: string;
  /**
   * How this command works
   */
  description?: string;
  /**
   * The roles you must have
   */
  roles?: (keyof typeof ROLES)[];
}

export interface ISubCommandData {
  /**
   * The roles you must have
   */
  roles?: (keyof typeof ROLES)[];
}

export type GrabCallback<Base> = Base extends (
  ctx: infer X,
  ...args: infer E
) => infer R
  ? (ctx: X, ...args: [...E]) => R
  : never;

export type AppendArgument<Base, Next> = Base extends (
  ctx: infer X,
  ...args: infer E
) => infer R
  ? (ctx: X, ...args: [...E, Next]) => R
  : never;

export type ArgumentTypeTable = {
  location: Location;
  number: number;
  string: string;
};

export type ArgumentTypeValue = keyof ArgumentTypeTable | ReadonlyArray<string>;

export type AddArgumentReturn<
  T extends ArgumentTypeValue | ISubCommandData,
  Callback
> = T extends ISubCommandData
  ? (ctx: Object) => void
  : AppendArgument<
      Callback,
      T extends keyof ArgumentTypeTable
        ? ArgumentTypeTable[T]
        : T extends ReadonlyArray<string>
        ? T[number]
        : never
    >;
