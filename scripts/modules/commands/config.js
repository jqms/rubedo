import { ModalFormData } from "mojang-minecraft-ui";
import { PROTECTIONS } from "../../config/protections.js";
import { Command } from "../../lib/Commands/Command.js";
import { getRole } from "../../utils.js";
import { Ban } from "../models/Ban.js";

const config = new Command({
  name: "config",
  description: "Opens up a form to configure rubedo",
  hasPermission: (player) => getRole(player) == "admin",
});

const protections = config.addSubCommand({
  name: "protections",
  description: "Change the config for protections",
});

config
  .addSubCommand({ name: "enable", description: "Enables a protection" })
  .addOption("protection", PROTECTIONS, "Protection to enable/disable")
  .executes((ctx, { protections }) => {});
