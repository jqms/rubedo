import { world } from "mojang-minecraft";
import { text } from "../../lang/text.js";
import { binaryToText, chunkString, runCommand, textToBinary } from "./utils";
import { MAX_DATABASE_STRING_SIZE } from "../../config/database";

/**
 * Minecraft Bedrock Gametest Database
 * @license MIT
 * @author Smell of curry
 * @version 1.0.0
 * --------------------------------------------------------------------------
 * This database stores data on players inside a objective
 * Each objective can only store 32768 string data inside its players
 * So we split up the save and save it across chunks in multiple objectives
 * --------------------------------------------------------------------------
 */

interface IMemory {
  index: number;
  data: string;
}

export class Database {
  TABLE_NAME: string;
  MEMORY: IMemory[];
  /**
   * Creates a new database
   */
  constructor(TABLE_NAME: string) {
    if (!/^([a-zA-Z]{1,16})$/.test(TABLE_NAME))
      throw new Error(text["api.database.error.table_name"](TABLE_NAME, 16));
    this.TABLE_NAME = TABLE_NAME;
    this.MEMORY = [];
    this.build();
    this.fetch();
  }

  /**
   * This grabs all the data from the database every time the world is loaded
   */
  fetch() {
    try {
      for (let i = 0; i <= this.SAVE_NAMES; i++) {
        const name = `${this.INDEX}_${i}`;
        const regex = new RegExp(`(?<=${name}\\()[0-1\\s]+(?=\\))`);
        const RAW_TABLE_DATA = this.SCOREBOARD_DATA.match(regex)[0];
        this.MEMORY.push({ index: i, data: `${RAW_TABLE_DATA}` });
      }
    } catch (error) {
      this.MEMORY = [{ index: 0, data: "01111011 01111101" }];
    }
  }

  /**
   * This builds the database and make sure the database is set
   */
  build(objective: string = this.TABLE_NAME) {
    runCommand(`scoreboard objectives add "DB_GLOBAL" dummy`);
    runCommand(`scoreboard objectives add ${objective} dummy`);
    runCommand(`scoreboard players add "DB_SAVE" ${objective} 0`);
    runCommand(`scoreboard players add "DB_INDEXS" "DB_GLOBAL" 0`);
  }

  /**
   * Wipes this database and clears all its data
   */
  wipe() {
    this.MEMORY = [];
    for (let i = 0; i <= this.SAVE_NAMES; i++) {
      const name = `${this.INDEX}_${i}`;
      runCommand(`scoreboard objectives remove ${name}`);
    }
    runCommand(`scoreboard objectives remove ${this.TABLE_NAME}`);
    this.build();
  }

  /**
   * Grabs all scoreboard data on the world
   */
  get SCOREBOARD_DATA(): string {
    return world.getDimension("overworld").runCommand(`scoreboard players list`)
      .statusMessage;
  }

  /**
   * Gets the ammount of saves on this database
   */
  get SAVE_NAMES() {
    try {
      const command = world
        .getDimension("overworld")
        .runCommand(
          `scoreboard players test "DB_SAVE" "${this.TABLE_NAME}" * *`
        );
      return parseInt(command.statusMessage.split(" ")[1]);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Sets the ammount of saves for this database
   */
  set SAVE_NAMES(value) {
    world
      .getDimension("overworld")
      .runCommand(
        `scoreboard players set "DB_SAVE" "${this.TABLE_NAME}" ${value}`
      );
  }

  /**
   * Grabs the index of this database to be used for string conversion
   */
  get INDEX(): number | null {
    try {
      const command = world
        .getDimension("overworld")
        .runCommand(
          `scoreboard players test "${this.TABLE_NAME}" "DB_GLOBAL" * *`
        );
      return parseInt(command.statusMessage.split(" ")[1]);
    } catch (error) {
      let index = null;
      try {
        const command = world
          .getDimension("overworld")
          .runCommand(`scoreboard players test DB_INDEXS "DB_GLOBAL" * *`);
        index = parseInt(command.statusMessage.split(" ")[1]) + 1;
      } catch (error) {
        index = 0;
      }
      world
        .getDimension("overworld")
        .runCommand(`scoreboard players set DB_INDEXS "DB_GLOBAL" ${index}`);
      this.INDEX = index;
      return index;
    }
  }

  /**
   * Sets the DB index this is used as small string convesion for the tablename
   */
  set INDEX(value) {
    world
      .getDimension("overworld")
      .runCommand(
        `scoreboard players set "${this.TABLE_NAME}" "DB_GLOBAL" ${value}`
      );
  }

  /**
   * Gets the database from the world
   * @returns {Object}
   */
  get data() {
    try {
      const data = this.MEMORY.map((a) => binaryToText(a.data));
      return JSON.parse(data.join(""));
    } catch (error) {
      return {};
    }
  }

  /**
   * Saves local memory data to database
   */
  save(json: Object) {
    const SPLIT_DATA = chunkString(
      JSON.stringify(json),
      MAX_DATABASE_STRING_SIZE
    );
    this.wipe();
    for (const [index, chunk] of SPLIT_DATA.entries()) {
      const name = `${this.INDEX}_${index}`;
      this.SAVE_NAMES = index;
      const data = textToBinary(chunk);
      this.MEMORY.push({
        index: index,
        data: data,
      });
      runCommand(`scoreboard objectives add ${name} dummy`);
      runCommand(`scoreboard players set "${name}(${data})" ${name} 0`);
    }
  }

  /**
   * Returns a value of a key
   */
  get(key: string): any | null {
    const data = this.data;
    return data[key];
  }

  /**
   * Sets a value into the database
   */
  set(key: string, value: any) {
    let data = this.data;
    data[key] = value;
    this.save(data);
  }

  /**
   * Check if the key exists in the table
   * @example Database.has('Test Key');
   */
  has(key: string): boolean {
    return this.keys().includes(key);
  }

  /**
   * Delete the key from the table
   * @example Database.delete('Test Key');
   */
  delete(key: string): boolean {
    let json = this.data;
    const status = delete json[key];
    this.save(json);
    return status;
  }

  /**
   * Returns the number of key/value pairs in the Map object.
   * @example Database.size()
   */
  size() {
    return this.keys().length;
  }

  /**
   * Clear everything in the table
   * @example Database.clear()
   */
  clear() {
    this.save({});
  }

  /**
   * Get all the keys in the table
   * @example Database.keys();
   */
  keys(): string[] {
    return Object.keys(this.data);
  }

  /**
   * Get all the values in the table
   * @example Database.values();
   */
  values(): any[] {
    return Object.values(this.data);
  }

  /**
   * Gets all the keys and values
   * @example Database.getCollection();
   */
  getCollection(): Object {
    return this.data;
  }
}
