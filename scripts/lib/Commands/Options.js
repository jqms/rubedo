import { OptionTypes } from "./OptionTypes.js";
export class CommandOption {
    /**
     * Registers a command option
     * @example new CommandOption("name",DefaultType,"the name of this", false)
     */
    constructor(name, type, description, optional = false) {
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
    verify(value) {
        if (Array.isArray(this.type))
            return OptionTypes.array.validate(value, this.type);
        // @ts-ignore
        return OptionTypes[this.type].validate(value);
    }
    /**
     * Validates the arg and returns the parsed value
     * @param {string} value
     * @returns {number | Location | boolean | string}
     */
    validate(value) {
        if (Array.isArray(this.type))
            return value;
        // @ts-ignore
        return OptionTypes[this.type].parse(value);
    }
}
