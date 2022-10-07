import { world } from "mojang-minecraft";
import { text } from "../../lang/text.js";
import { binaryToText, chunkString, runCommand, textToBinary } from "./utils";
import { MAX_DATABASE_STRING_SIZE } from "../../config/database";
export class Database {
    constructor(TABLE_NAME) {
        if (!/^([a-zA-Z]{1,16})$/.test(TABLE_NAME))
            throw new Error(text["api.database.error.table_name"](TABLE_NAME, 16));
        this.TABLE_NAME = TABLE_NAME;
        this.MEMORY = [];
        this.build();
        this.fetch();
    }
    fetch() {
        try {
            for (let i = 0; i <= this.SAVE_NAMES; i++) {
                const name = `${this.INDEX}_${i}`;
                const regex = new RegExp(`(?<=${name}\\()[0-1\\s]+(?=\\))`);
                const RAW_TABLE_DATA = this.SCOREBOARD_DATA.match(regex)[0];
                this.MEMORY.push({ index: i, data: `${RAW_TABLE_DATA}` });
            }
        }
        catch (error) {
            this.MEMORY = [{ index: 0, data: "01111011 01111101" }];
        }
    }
    build(objective = this.TABLE_NAME) {
        runCommand(`scoreboard objectives add "DB_GLOBAL" dummy`);
        runCommand(`scoreboard objectives add ${objective} dummy`);
        runCommand(`scoreboard players add "DB_SAVE" ${objective} 0`);
        runCommand(`scoreboard players add "DB_INDEXS" "DB_GLOBAL" 0`);
    }
    wipe() {
        this.MEMORY = [];
        for (let i = 0; i <= this.SAVE_NAMES; i++) {
            const name = `${this.INDEX}_${i}`;
            runCommand(`scoreboard objectives remove ${name}`);
        }
        runCommand(`scoreboard objectives remove ${this.TABLE_NAME}`);
        this.build();
    }
    get SCOREBOARD_DATA() {
        return world.getDimension("overworld").runCommand(`scoreboard players list`)
            .statusMessage;
    }
    get SAVE_NAMES() {
        try {
            const command = world
                .getDimension("overworld")
                .runCommand(`scoreboard players test "DB_SAVE" "${this.TABLE_NAME}" * *`);
            return parseInt(command.statusMessage.split(" ")[1]);
        }
        catch (error) {
            return 0;
        }
    }
    set SAVE_NAMES(value) {
        world
            .getDimension("overworld")
            .runCommand(`scoreboard players set "DB_SAVE" "${this.TABLE_NAME}" ${value}`);
    }
    get INDEX() {
        try {
            const command = world
                .getDimension("overworld")
                .runCommand(`scoreboard players test "${this.TABLE_NAME}" "DB_GLOBAL" * *`);
            return parseInt(command.statusMessage.split(" ")[1]);
        }
        catch (error) {
            let index = null;
            try {
                const command = world
                    .getDimension("overworld")
                    .runCommand(`scoreboard players test DB_INDEXS "DB_GLOBAL" * *`);
                index = parseInt(command.statusMessage.split(" ")[1]) + 1;
            }
            catch (error) {
                index = 0;
            }
            world
                .getDimension("overworld")
                .runCommand(`scoreboard players set DB_INDEXS "DB_GLOBAL" ${index}`);
            this.INDEX = index;
            return index;
        }
    }
    set INDEX(value) {
        world
            .getDimension("overworld")
            .runCommand(`scoreboard players set "${this.TABLE_NAME}" "DB_GLOBAL" ${value}`);
    }
    get data() {
        try {
            const data = this.MEMORY.map((a) => binaryToText(a.data));
            return JSON.parse(data.join(""));
        }
        catch (error) {
            return {};
        }
    }
    save(json) {
        const SPLIT_DATA = chunkString(JSON.stringify(json), MAX_DATABASE_STRING_SIZE);
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
    get(key) {
        const data = this.data;
        return data[key];
    }
    set(key, value) {
        let data = this.data;
        data[key] = value;
        this.save(data);
    }
    has(key) {
        return this.keys().includes(key);
    }
    delete(key) {
        let json = this.data;
        const status = delete json[key];
        this.save(json);
        return status;
    }
    size() {
        return this.keys().length;
    }
    clear() {
        this.save({});
    }
    keys() {
        return Object.keys(this.data);
    }
    values() {
        return Object.values(this.data);
    }
    getCollection() {
        return this.data;
    }
}
