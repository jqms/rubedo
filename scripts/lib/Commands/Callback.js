export class CommandCallback {
    constructor(data, args) {
        this.data = data;
        this.args = args;
        this.sender = data.sender;
    }
    reply(text) {
        this.sender.tell(text);
    }
    run(command) {
        try {
            this.sender.runCommand(command);
        }
        catch (error) { }
    }
    invalidArg(arg) {
        this.sender.tell({
            translate: `commands.generic.parameter.invalid`,
            with: [arg],
        });
    }
    invalidPermission() {
        this.sender.tell({
            translate: `commands.generic.permission.selector`,
        });
    }
    give(item) {
        const inventory = this.sender.getComponent("minecraft:inventory").container;
        inventory.addItem(item);
    }
}
