import {
  DynamicPropertiesDefinition,
  EntityTypes,
  world,
  system,
} from "mojang-minecraft";
import { Return } from "./app/Exceptions/Return.js";
import { IEntity } from "./app/Models/Entity.js";
import { IWorld } from "./app/Models/World.js";
import { Request } from "./app/Models/Request.js";
import { Chat } from "./app/Providers/Chat.js";
import { Command } from "./app/Contracts/Commands/Command.js";
import { Permission } from "./app/Contracts/Permission/Permission.js";
import { Group } from "./app/Contracts/Permission/Group.js";
import { text } from "./lang/text.js";
import { emoji } from "./lang/emoji.js";
import { profanity } from "./lang/profanirty.js";
import { ItemDatabase } from "./database/types/Item.js";
import { ScoreboardDatabase } from "./database/types/Scoreboard.js";
import { Page } from "./app/Contracts/Chest GUI/Models/Page.js";
import { Item } from "./app/Contracts/Chest GUI/Models/Item.js";
import { DefaultFill } from "./app/Contracts/Chest GUI/Models/FillTypes.js";
import { OBJECTIVES } from "./config/app.js";
import * as form from "./app/Providers/Form.js";
import * as configuration from "./config/index.js";
import * as scheduling from "./app/Utilities/scheduling.js";
import * as format from "./app/Utilities/formatter.js";
import * as Buttons from "./app/Contracts/Chest GUI/Models/Buttons.js";
import "./app/Contracts/Chest GUI/index.js";

export const tables = {};

/**
 * Smelly API
 * @license MIT
 * @author Smell of curry
 * @version 3.0.0
 * --------------------------------------------------------------------------
 * This is the main export file it exports all modules and moduleses
 * of Smelly API please do not try to change or configure any line in this file
 * Because it could end up breaking smelly api and its connected plugins
 * --------------------------------------------------------------------------
 */
export class SA {
  static prefix = configuration.commands.PREFIX;
  static version = configuration.app.VERSION;
  static config = configuration;
  /**
   * @type {Object<string, ScoreboardDatabase>}
   */
  static tables = tables;
  static Command = Command;
  static Permission = Permission;
  static Group = Group;
  static Lang = {
    lang: text,
    emoji: emoji,
    profanity: profanity,
  };
  static Exceptions = {
    return: Return,
  };
  static Models = {
    entity: IEntity,
    request: Request,
    world: IWorld,
  };
  static Providers = {
    chat: Chat,
    form: form,
  };
  static Utilities = {
    time: scheduling,
    format: format,
    storage: {
      item: ItemDatabase,
      scoreboard: ScoreboardDatabase,
    },
  };
  static ChestGUI = {
    FillTypes: {
      default: DefaultFill,
    },
    Buttons: Buttons,
    Page: Page,
    Item: Item,
  };

  /**
   * Gets the ping of the server
   * @returns {Promise<number>}
   */
  static async getPing() {
    let currentPing = 0;
    let e = world.events.tick.subscribe(({ deltaTime }) => {
      currentPing = 1 / deltaTime;
      world.events.tick.unsubscribe(e);
    });
    return currentPing;
  }

  /**
   * Gets ths current tick of the server
   * @returns {Promise<number>}
   */
  static async getTick() {
    let tick = 0;
    let e = world.events.tick.subscribe(({ currentTick }) => {
      tick = currentTick;
      world.events.tick.unsubscribe(e);
    });
    return tick;
  }
}

/**
 * Runs a command in the overworld
 * @param {String} command command to run
 */
function runCommand(command) {
  try {
    world.getDimension("overworld").runCommand(command);
  } catch (error) {}
}

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  /**
   * Loads Ticking Area
   */
  runCommand(`tickingarea add 0 0 0 0 0 0 db true`);

  /**
   * Loads Dynamic Propertys
   */
  try {
    let q = new DynamicPropertiesDefinition();
    q.defineString("objective", 16);
    propertyRegistry.registerEntityTypeDynamicProperties(
      q,
      EntityTypes.get("binocraft:floating_text")
    );
  } catch (error) {}

  /**
   * Loads Objectives
   */
  for (const objective of OBJECTIVES) {
    runCommand(
      `scoreboard objectives add ${objective.objective} dummy ${
        objective.displayName ?? ""
      }`
    );
  }

  /**
   * Loads Plugins
   */
  import("./vendor/autoload.js");
});

system.events.beforeWatchdogTerminate.subscribe((data) => {
  console.warn(`WATCHDOG TRIED TO CRASH GAME REASON: ${data.terminateReason}`);
  data.cancel = true;
});
