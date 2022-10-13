import { Location } from "mojang-minecraft";
import { OptionTypes } from "./OptionTypes.js";

export class CommandOption {
  name: string;
  type: string | Array<any>;
  description?: string;
  optional?: boolean;
  /**
   * Registers a command option
   * @example new CommandOption("name",DefaultType,"the name of this", false)
   */
  constructor(
    name: string,
    type: string | Array<any>,
    description: string,
    optional: boolean = false
  ) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.optional = optional;
  }
  /**
   * Verifys the string to see if it meets the critera of the type
   * @param {string} value
   * @returns {Boolean}
   */
  verify(value: string): boolean {
    if (Array.isArray(this.type)) return OptionTypes.array.validate(value, this.type);
    // @ts-ignore
    return OptionTypes[this.type].validate(value);
  }
  /**
   * Validates the arg and returns the parsed value
   * @param {string} value
   * @returns {number | Location | boolean | string}
   */
  validate(value: string): number | Location | boolean | string {
    if (Array.isArray(this.type)) return value;
    // @ts-ignore
    return OptionTypes[this.type].parse(value);
  }
}
