import {
  BeforeChatEvent,
  InventoryComponentContainer,
  ItemStack,
} from "mojang-minecraft";
import { broadcast, runCommand } from "../../utils";

export class CommandCallback {
  /**
   * Returns a commands callback
   * @param {BeforeChatEvent} data chat data that was used
   * @param {Array<string>} args aguments used this will exclude command name and subcommand name
   * @param {Object<any>} options same object names as input
   * @example new CommandCallback(BeforeChatEvent, ["2", "sd"], ["size"])
   */
  constructor(data, args, options) {
    this.data = data;
    this.args = args;
    this.sender = data.sender;
  }
  /**
   * Replys to the sender of a command callback
   * @param {string} text Message or a lang code
   * @param {Array<string>} args lang arguments
   * @example ctx.reply('Hello World!');
   */
  reply(text, args = []) {
    broadcast(text, this.sender.nameTag, args);
  }
  /**
   * Runs a command on player
   * @param {string} command Message or a lang code
   * @example ctx.run('say hey');
   */
  run(command) {
    try {
      this.sender.runCommand(command);
    } catch (error) {}
  }
  /**
   * Replys to the sender that a error has occured
   * @param {string} arg Parameter that was invalid
   * @example ctx.invalidArg('player');
   */
  invalidArg(arg) {
    broadcast(`commands.generic.parameter.invalid`, this.sender.nameTag, [arg]);
  }
  /**
   * Replys to the sender that a error has occured
   * @param {string} arg Parameter that was invalid
   * @example ctx.invalidPermission();
   */
  invalidPermission() {
    broadcast(`commands.generic.permission.selector`, this.sender.nameTag);
  }
  /**
   * Gives the sender a item
   * @param {ItemStack} item Item to give
   * @param {number} amount ammount to give
   * @param {number} data data of item
   * @example ctx.give('sword 10 2');
   */
  give(item) {
    /**
     * @type {InventoryComponentContainer}
     */
    const inventory = this.sender.getComponent("minecraft:inventory").container;
    inventory.addItem(item);
  }
}
