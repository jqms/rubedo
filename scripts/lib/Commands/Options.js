import { OptionTypes } from "./OptionTypes.js";
export class CommandOption {
    constructor(name, type, description, optional = false) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.optional = optional;
    }
    verify(value) {
        if (Array.isArray(this.type))
            return OptionTypes.array.validate(value, this.type);
        return OptionTypes[this.type].validate(value);
    }
    validate(value) {
        if (Array.isArray(this.type))
            return value;
        return OptionTypes[this.type].parse(value);
    }
}
