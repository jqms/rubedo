import { TABLES } from "../../lib/Database/tables";
export class ChangePlayerRoleTask {
    constructor(playerName, role) {
        const tasks = ChangePlayerRoleTask.getTasks();
        tasks.push({ playerName: playerName, role: role });
        TABLES.tasks.set("changePlayerRole", tasks);
    }
    static getTasks() {
        return TABLES.tasks.get("changePlayerRole") ?? [];
    }
    static getPlayersRoleToSet(playerName) {
        const tasks = ChangePlayerRoleTask.getTasks();
        return tasks.find((t) => t.playerName == playerName)?.role;
    }
}
