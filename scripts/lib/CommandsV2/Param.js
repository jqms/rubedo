import { fetch } from "../Commands/utils";

export class Param {
  /**
   * Creates a new command param
   * @param {String} name the name of this param
   * @param {"string" | "int" | "float" | "boolean" | "player" | "target" | Array} type
   * @param {string} description short description of this param
   * @param {Boolean} optional if this can be left blank
   */
  constructor(name, type, description, optional = false) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.optional = optional;
  }
  /**
   * validates a value and if it matches this param type
   * @param {string} value value to verify
   * @returns {Boolean}
   */
  validate(value) {
    if (Array.isArray(this.type)) return this.type.includes(value);
    if (this.type == "string") return value && value != "";
    if (this.type == "int") return !isNaN(value);
    if (this.type == "float") return value?.match(/^\d+\.\d+$/)?.[0];
    if (this.type == "boolean") return value?.match(/^(true|false)$/)?.[0];
    if (this.type == "player") return fetch(value) ? true : false;
    if (this.type == "target") return value?.match(/^(@.|"[\s\S]+")$/)?.[0];
    return false;
  }

  /**
   * parses the inputed value to this Params ParamType
   * @param {string} value value to parse
   * @returns {number | boolean | string}
   */
  parse(value) {
    if (this.type == "int") return parseInt(value);
    if (this.type == "float") return parseFloat(value);
    if (this.type == "boolean") return value == "true" ? true : false;
    if (this.type == "player") return fetch(value);
    // If there is no parsing needed just return the value
    return value;
  }
}
