const LOCATION_REGEX = /^([~^]{0,1}(-\d)?(\d*)?(\.(\d+))?)$/;
export class Argument {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    validate(value) {
        if (!value)
            return false;
        if (Array.isArray(this.type) && this.type.includes(value))
            return true;
        if (typeof this.type == "object" && this.name == value)
            return true;
        if (this.type == "number" && value.match(/^-?\d+$/))
            return true;
        if (this.type == "location" && value.match(LOCATION_REGEX))
            return true;
        if (this.type == "string")
            return true;
        return false;
    }
    error() {
        if (Array.isArray(this.type))
            return `Expected value one of ${this.type}`;
    }
}
