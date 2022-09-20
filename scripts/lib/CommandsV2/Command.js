import { Param } from "./Param";
import { CommandCallback } from "./CommandCallaback";
import { world } from "mojang-minecraft";
import { PREFIX } from "../../config/commands";
import { commandNotFound, getChatAugments } from "./utils";

/**
 * @typedef {Object} CommandData
 * @property {String} name name of the command
 * @property {String} description description of the command
 * @property {Array<String>} aliases other names this command goes by
 * @property {(Player) => Boolean} hasPermission a function to determine if this player has permission to use this command
 */

/**
 * @typedef {Object} CommandParamCallback
 * @property {String} name name of the command
 * @property {String} description description of the command
 * @property {Array<String>} aliases other names this command goes by
 * @property {(Player) => Boolean} hasPermission a function to determine if this player has permission to use this command
 */

/**
 * All commands that are made
 * @type {Array<Command>}
 */
export const COMMANDS = [];

world.events.beforeChat.subscribe((data) => {
  if (!data.message.startsWith(PREFIX)) return;
  data.cancel = true;
  const args = getChatAugments(data);
  const command = COMMANDS.find((c) => args[0] == c.data.name);
  if (!command) return commandNotFound(data);
});

export class Command {
  /**
   * Gets the Command from an array of args
   * @param {Array<string>} args args to get command with, ex: ["role", "set", "member"], ["role"], ["role", "clear"]
   * @returns {Command}
   */
  static getCommand(args) {}
  /**
   * Creates a new command
   * @param {CommandData} data the data of this command
   */
  constructor(data) {
    this.data = data;

    /**
     * The Callaback to run when this command is called
     */
    this.callback = null;

    /**
     * Commands that this command is attached to
     * @type {Array<Command>}
     */
    this.subCommands = [];

    /**
     * Commands that this command is attached to
     * @type {Array<Param>}
     */
    this.params = [];

    COMMANDS.push(this);
  }

  /**
   * Updates the paths of this command
   */
  generatePaths() {
    this.paths.push([this.data.name]);
    this.paths.push(this.params.map((p) => p.name).concat([this.data.name]));
  }

  /**
   * Adds a param to this command
   * @param {Param} param the option to add
   * @returns {Command}
   */
  addParam(param) {
    this.params.push(param);
    return this;
  }

  /**
   * Adds a sub command to this command
   * @param {Command} command command to add
   * @returns {Command} THIS command not the subCommand
   */
  addSubCommand(command) {
    this.subCommands.push(command);
    return this;
  }

  /**
   * Changes the callback to here instead of the orginal or undefined callaback from command creation
   * @param {function(CommandCallback, Object)} callback callback to run
   * @returns {Command}
   * @example executes((ctx) => {})
   */
  executes(callback) {
    this.callback = callback;
    return this;
  }
}
