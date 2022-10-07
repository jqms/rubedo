import {
  BeforeChatEvent,
  InventoryComponentContainer,
  ItemStack,
  Player,
} from "mojang-minecraft";

export class CommandCallback {
  data: BeforeChatEvent;
  args: Array<string>;
  sender: Player;
  /**
   * Returns a commands callback
   * @param data chat data that was used
   * @param args aguments used this will exclude command name and subcommand name
   * @param options same object names as input
   * @example new CommandCallback(BeforeChatEvent, ["2", "sd"], ["size"])
   */
  constructor(data: BeforeChatEvent, args: Array<string>) {
    this.data = data;
    this.args = args;
    this.sender = data.sender;
  }
  /**
   * Replys to the sender of a command callback
   * @param text Message or a lang code
   * @example ctx.reply('Hello World!');
   */
  reply(text: string) {
    this.sender.tell(text);
  }
  /**
   * Runs a command on player
   * @param command Message or a lang code
   * @example ctx.run('say hey');
   */
  run(command: string) {
    try {
      this.sender.runCommand(command);
    } catch (error) {}
  }
  /**
   * Replys to the sender that a error has occured
   * @param arg Parameter that was invalid
   * @example ctx.invalidArg('player');
   */
  invalidArg(arg: string) {
    // @ts-ignore
    this.sender.tell({
      translate: `commands.generic.parameter.invalid`,
      with: [arg],
    });
  }
  /**
   * Replys to the sender that a error has occured
   * @example ctx.invalidPermission();
   */
  invalidPermission() {
    // @ts-ignore
    this.sender.tell({
      translate: `commands.generic.permission.selector`,
    });
  }
  /**
   * Gives the sender a item
   * @param item Item to give
   * @example ctx.give(ItemStack);
   */
  give(item: ItemStack) {
    const inventory = this.sender.getComponent("minecraft:inventory").container;
    inventory.addItem(item);
  }
}
