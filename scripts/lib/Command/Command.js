import { COMMANDS } from "./index.js";
import { Argument } from "./Argument";
export class Command {
    constructor(data) {
        this.data = data;
        this.args = [];
        this.callback = null;
        COMMANDS.push(this);
    }
    addArgument(name, type = {}) {
        this.args.push(new Argument(name, type));
        return this;
    }
    executes(callback) {
        this.callback = callback;
    }
}
