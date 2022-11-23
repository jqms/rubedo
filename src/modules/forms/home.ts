import { Player } from "@minecraft/server";
import { ActionForm } from "../../lib/Form/Models/ActionForm";
import * as settings from "./settings";
import * as automod from "./automod";

export function showHome(player: Player) {
  new ActionForm("Rubedo Settings")
    .addButton("Auto Mod", "textures/ui/permissions_op_crown.png", () => {
      automod.showPage1(player);
    })
    .addButton("Banned items", "textures/blocks/sculk_shrieker_top.png", () => {
      settings.showPage1Home(player);
    })
    .addButton("Banned blocks", "textures/blocks/barrier.png", () => {
      settings.showPage2(player);
    })
    .addButton("Enchantments", "textures/items/book_enchanted.png", () => {
      settings.showPage3(player);
    })
    .addButton("Appeal Link", "textures/ui/Feedback.png", () => {
      settings.showPage4(player);
    })
    .show(player);
}
