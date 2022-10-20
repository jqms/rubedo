import { Player, world } from "mojang-minecraft";
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

  constructor(public name: string = "float") {
    this.name = name;
  }
}

export class LocationArgumentType implements IArgumentType {
  type: string;
  typeName = "location";
  matches(value: string): IArgumentReturnData<string> {
    return {
      success: !isNaN(value as any),
      value: value,
    };
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

  constructor(public name: string = "array", public types: T) {
    this.name = name;
    this.types = types;

    this.typeName = types.join(" | ").replace(/(.{25})..+/, "$1...");
  }
}

export class UnitArgumentType implements IArgumentType {
  type: MSValueType;
  typeName = "UnitValueType";
  matches(value: string): IArgumentReturnData<MSValueType> {
    if (
      ![
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
      ].includes(value)
    )
      return {
        success: false,
      };
    return {
      success: value && value != "",
      value: value as MSValueType,
    };
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
