import { fetch } from "./utils.js";

class DefaultType {
  /**
   * The Fail message for the value
   */
  static fail = "commands.generic.parameter.invalid";
  /**
   * Validates a argument
   */
  static validate = (value: string) => value && value != "";
  /**
   * Parses a argument
   */
  static parse = (value: string) => value;
}

class IntegerOption {
  static fail = "commands.generic.num.invalid";
  static validate = (value: any) => !isNaN(value);
  static parse = (value: string) => parseInt(value);
}

class FloatOption {
  static fail = IntegerOption.fail;
  static validate = (value: any) => value?.match(/^\d+\.\d+$/)?.[0];
  static parse = (value: string) => parseFloat(value);
}

class LocationOption {
  static fail = IntegerOption.fail;
  static validate = (value: any) =>
    value?.match(/^([\~\^]{1})?([-]?\d*)$/)?.[0];
  static parse = (value: string) => value;
}

class BooleanOption {
  static fail = "commands.generic.boolean.invalid";
  static validate = (value: any) => value?.match(/^(true|false)$/)?.[0];
  static parse = (value: string) => (value == "true" ? true : false);
}

class PlayerOption {
  static fail = "commands.generic.player.notFound";
  static validate = (value: any) => (fetch(value) ? true : false);
  static parse = (value: string) => fetch(value);
}

class TargetOption {
  static fail = "commands.generic.player.notFound";
  static validate = (value: any) => value?.match(/^(@.|"[\s\S]+")$/)?.[0];
  static parse = (value: string) => value;
}

class ArrayOption {
  static fail = "commands.generic.parameter.invalid";
  static validate = (value: any, types: any[]) => types.includes(value);
  static parse = (value: string) => value;
}

export const OptionTypes = {
  string: DefaultType,
  int: IntegerOption,
  float: FloatOption,
  location: LocationOption,
  boolean: BooleanOption,
  player: PlayerOption,
  target: TargetOption,
  array: ArrayOption,
};
