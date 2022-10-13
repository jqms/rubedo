import type { ArgumentTypeTable, ISubCommandData } from "./types";

/**
 * A Regex used to verify a location axis for chat input
 */
const LOCATION_REGEX = /^([~^]{0,1}(-\d)?(\d*)?(\.(\d+))?)$/;

export class Argument {
  /**
   * The name of this argument, this is also the name of this command
   */
  name: string;

  /**
   * This is the type of this argument
   * it can be a argument table type, an array of diffrent types
   * or it can be details for a subCommand
   */
  type: keyof ArgumentTypeTable | ReadonlyArray<string> | ISubCommandData;

  constructor(
    name: string,
    type: keyof ArgumentTypeTable | ReadonlyArray<string> | ISubCommandData
  ) {
    this.name = name;
    this.type = type;
  }

  /**
   * Validates a argument to this Arguments type to verify if it works
   * @param value arg to validate
   */
  validate(value: string): boolean {
    if (!value) return false;
    if (Array.isArray(this.type) && this.type.includes(value)) return true;
    if (typeof this.type == "object" && this.name == value) return true;
    if (this.type == "number" && value.match(/^-?\d+$/)) return true;
    if (this.type == "location" && value.match(LOCATION_REGEX)) return true;
    if (this.type == "string") return true;
    return false;
  }

  /**
   * Returns an error message for this type
   */
  error(): string {
    if (Array.isArray(this.type)) return `Expected value one of ${this.type}`;
  }
}
