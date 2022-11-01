import { Player, world } from "@minecraft/server";
import type { MSValueType } from "../../types";

/**
 * Fetch an online players data
 */
export function fetch(playerName: string): Player | null {
  return [...world.getPlayers()].find((plr) => plr.name === playerName);
}

export interface IArgumentReturnData<T> {
  /**
   * If this argument matches the value
   */
  success: boolean;
  /**
   * The parsed value that should be passed in command callback
   * if there is no return type this will be null
   */
  value?: T;
}

export abstract class IArgumentType {
  /**
   * The return type
   */
  type: any;
  /**
   * The name that the help for this command will see
   * @example "string"
   * @example "Location"
   * @example "int"
   * @example "number"
   * @example "UnitType"
   */
  typeName: string;
  /**
   * The name this argument is
   */
  name: string = "name";
  /**
   * Checks if a value matches this argument type, also
   * returns the corridsponding type
   */
  matches(value: string): IArgumentReturnData<any> {
    return { success: true };
  }
  /**
   * the fail message that should be sent if player fails to meet the matches critera
   * @param value value that was sent
   * @returns what would happen if you didnt enter the right value
   */
  fail(value: string): string {
    return `Value must be of type string!`;
  }
  constructor(name: string = "any") {}
}

export class LiteralArgumentType implements IArgumentType {
  type: null;
  typeName = "literal";
  matches(value: string): IArgumentReturnData<null> {
    return {
      success: this.name == value,
    };
  }
  fail(value: string): string {
    return `${value} should be ${this.name}!`;
  }
  constructor(public name: string = "literal") {
    this.name = name;
  }
}

export class StringArgumentType implements IArgumentType {
  type: string;
  typeName = "string";
  matches(value: string): IArgumentReturnData<string> {
    return {
      success: value && value != "",
      value: value,
    };
  }
  fail(value: string): string {
    return `Value must be of type string!`;
  }
  constructor(public name: string = "string") {
    this.name = name;
  }
}

export class IntegerArgumentType implements IArgumentType {
  type: number;
  typeName = "int";
  matches(value: string): IArgumentReturnData<number> {
    return {
      success: !isNaN(value as any),
      value: parseInt(value),
    };
  }
  fail(value: string): string {
    return `Value must be vaild number!`;
  }
  constructor(public name: string = "integer") {
    this.name = name;
  }
}

export class FloatArgumentType implements IArgumentType {
  type: number;
  typeName = "float";
  matches(value: string): IArgumentReturnData<number> {
    return {
      success: Boolean(value?.match(/^\d+\.\d+$/)?.[0]),
      value: parseInt(value),
    };
  }
  fail(value: string): string {
    return `Value must be vaild float!`;
  }
  constructor(public name: string = "float") {
    this.name = name;
  }
}

export class LocationArgumentType implements IArgumentType {
  type: string;
  typeName = "location";
  matches(value: string): IArgumentReturnData<string> {
    return {
      success: /^([~^]{0,1}(-\d)?(\d*)?(\.(\d+))?)$/.test(value),
      value: value,
    };
  }
  fail(value: string): string {
    return `Value needs to be a vaild number, value can include: [~,^]`;
  }
  constructor(public name: string = "location") {
    this.name = name;
  }
}

export class BooleanArgumentType implements IArgumentType {
  type: boolean;
  typeName = "boolean";
  matches(value: string): IArgumentReturnData<boolean> {
    return {
      success: Boolean(value?.match(/^(true|false)$/)?.[0]),
      value: value == "true" ? true : false,
    };
  }
  fail(value: string): string {
    return `"${value}" can be either "true" or "false"`;
  }
  constructor(public name: string = "boolean") {
    this.name = name;
  }
}

export class PlayerArgumentType implements IArgumentType {
  type: Player;
  typeName = "playerName";
  matches(value: string): IArgumentReturnData<Player> {
    return {
      success: fetch(value) ? true : false,
      value: fetch(value),
    };
  }
  fail(value: string): string {
    return `player: "${value}", is not in this world`;
  }
  constructor(public name: string = "player") {
    this.name = name;
  }
}

export class TargetArgumentType implements IArgumentType {
  type: string;
  typeName = "Target";
  matches(value: string): IArgumentReturnData<string> {
    return {
      success: Boolean(value?.match(/^(@.|"[\s\S]+")$/)?.[0]),
      value: value,
    };
  }
  fail(value: string): string {
    return `${value} is not a vaild target`;
  }
  constructor(public name: string = "target") {
    this.name = name;
  }
}

export class ArrayArgumentType<T extends ReadonlyArray<string>>
  implements IArgumentType
{
  type: T[number];
  typeName = "string";
  matches(value: string): IArgumentReturnData<string> {
    return {
      success: this.types.includes(value),
      value: value,
    };
  }
  fail(value: string): string {
    return `"${value}" must be one of these values: ${this.types.join(" | ")}`;
  }
  constructor(public name: string = "array", public types: T) {
    this.name = name;
    this.types = types;

    this.typeName = types.join(" | ").replace(/(.{25})..+/, "$1...");
  }
}

export class UnitArgumentType implements IArgumentType {
  type: MSValueType;
  typeName = "UnitValueType";
  types: string[] = [
    "years",
    "yrs",
    "weeks",
    "days",
    "hours",
    "hrs",
    "minutes",
    "mins",
    "seconds",
    "secs",
    "milliseconds",
    "msecs",
    "ms",
  ];
  matches(value: string): IArgumentReturnData<MSValueType> {
    if (!this.types.includes(value))
      return {
        success: false,
      };
    return {
      success: value && value != "",
      value: value as MSValueType,
    };
  }
  fail(value: string): string {
    return `"${value}" must be one of these values: ${this.types.join(" | ")}`;
  }
  constructor(public name: string) {}
}

export const ArgumentTypes = {
  string: StringArgumentType,
  int: IntegerArgumentType,
  float: FloatArgumentType,
  location: LocationArgumentType,
  boolean: BooleanArgumentType,
  player: PlayerArgumentType,
  target: TargetArgumentType,
  array: ArrayArgumentType,
  unit: UnitArgumentType,
};