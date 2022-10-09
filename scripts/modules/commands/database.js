import { Command } from "../../lib/Commands/Command";
import { TABLES } from "../../lib/Database/tables";
import { getRole } from "../../utils";
const dbcm = new Command({
    name: "database",
    description: "Interacts with SA Database",
    aliases: ["db"],
    hasPermission: (player) => getRole(player) == "admin",
});
dbcm
    .addSubCommand({
    name: "get",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("table", "string", "Table to grab from")
    .addOption("key", "string", "Key to grab")
    .executes((ctx, { table, key }) => {
    try {
        const data = TABLES[table].get(key);
        if (data) {
            ctx.reply(data);
        }
        else {
            ctx.reply(`No data could be found for key ${key}`);
        }
    }
    catch (error) {
        ctx.reply(error + error.stack);
    }
});
dbcm
    .addSubCommand({
    name: "set",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("table", "string", "Table to set to")
    .addOption("key", "string", "Key to set")
    .addOption("value", "string", "Value to assign to the key")
    .executes((ctx, { table, key, value }) => {
    try {
        TABLES[table].set(key, value);
        ctx.reply(`Set Key: "${key}", to value: "${value}" on table: "${table}"`);
    }
    catch (error) {
        ctx.reply(error + error.stack);
    }
});
dbcm
    .addSubCommand({
    name: "clear",
    hasPermission: (player) => getRole(player) == "admin",
})
    .addOption("table", "string", "Table to set to")
    .executes((ctx, { table }) => {
    try {
        TABLES[table].clear();
        ctx.reply(`Cleared Table ${table}`);
    }
    catch (error) {
        ctx.reply(error + error.stack);
    }
});
