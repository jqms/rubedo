import { Player } from "@minecraft/server";
import { TABLES } from "../../lib/Database/tables";
import { ActionForm } from "../../lib/Form/Models/ActionForm";
import { ModalForm } from "../../lib/Form/Models/ModelForm";

export function showPage1(player: Player) {
  new ActionForm("Rubedo Settings")
    .addButton("Anti Spam", "textures/ui/permissions_op_crown.png", () => {
      showPage2(player);
    })
    .addButton("Cbe", "textures/blocks/sculk_shrieker_top.png", () => {
      showPage3(player);
    })
    .addButton("Gamemode", "textures/blocks/barrier.png", () => {
      showPage4(player);
    })
    .addButton("Nuker", "textures/ui/Feedback.png", () => {
      showPage5(player);
    })
    .show(player);
}

export function showPage2(player: Player) {
  const spam_config = TABLES.config.get("spam_config") ?? {
    repeatedMessages: true,
    zalgo: true,
    violationCount: 0,
    permMutePlayer: false,
  };
  new ModalForm("Manage Spam Protection")
    .addToggle("Ban Repeated Messages", spam_config.repeatedMessages)
    .addToggle("Ban Zalgo", spam_config.zalgo)
    .addSlider(
      "Violation Count before ban (if ban is false this does nothing)",
      0,
      20,
      1,
      spam_config.violationCount
    )
    .addToggle("Perm Mute Player", spam_config.permMutePlayer)
    .show(
      player,
      (ctx, repeatedMessages, zalgo, violationCount, permMutePlayer) => {
        TABLES.config.set("spam_config", {
          repeatedMessages: repeatedMessages,
          zalgo: zalgo,
          violationCount: violationCount,
          permMutePlayer: permMutePlayer,
        });
        player.tell(`Updated Spam Protection settings!`);
      }
    );
}

export function showPage3(player: Player) {
  const cbe_data = TABLES.config.get("cbe_config") ?? {
    clearItem: true,
    violationCount: 0,
    banPlayer: false,
  };
  new ModalForm("Manage CBE Protection")
    .addToggle("Clear Item", cbe_data.clearItem)
    .addSlider(
      "Violation Count before ban (if ban is false this does nothing)",
      0,
      20,
      1,
      cbe_data.violationCount
    )
    .addToggle("Ban Player", cbe_data.banPlayer)
    .show(player, (ctx, clearItem, violationCount, banPlayer) => {
      TABLES.config.set("cbe_config", {
        clearItem: clearItem,
        violationCount: violationCount,
        banPlayer: banPlayer,
      });
      player.tell(`Updated CBE Protection settings!`);
    });
}

export function showPage4(player: Player) {
  const gamemode_data = TABLES.config.get("gamemode_config") ?? {
    setToSurvival: true,
    clearPlayer: true,
    violationCount: 0,
    banPlayer: false,
  };
  new ModalForm("Manage Gamemode Protection")
    .addToggle("Set to survival", gamemode_data.setToSurvival)
    .addToggle(
      "Clear Player (Once this players gamemode has been switched back to survival should it clear the inventory?)",
      gamemode_data.clearPlayer
    )
    .addSlider(
      "Violation Count before ban (if ban is false this does nothing)",
      0,
      20,
      1,
      gamemode_data.violationCount
    )
    .addToggle("Ban Player", gamemode_data.banPlayer)
    .show(
      player,
      (ctx, setToSurvival, clearPlayer, violationCount, banPlayer) => {
        TABLES.config.set("gamemode_config", {
          setToSurvival: setToSurvival,
          clearPlayer: clearPlayer,
          violationCount: violationCount,
          banPlayer: banPlayer,
        });
        player.tell(`Updated Gamemode Protection settings!`);
      }
    );
}

export function showPage5(player: Player) {
  const nuker_data = TABLES.config.get("nuker_data") ?? {
    violationCount: 0,
    banPlayer: false,
  };
  new ModalForm("Manage Gamemode Protection")
    .addSlider(
      "Violation Count before ban (if ban is false this does nothing)",
      0,
      20,
      1,
      nuker_data.violationCount
    )
    .addToggle("Ban Player", nuker_data.banPlayer)
    .show(player, (ctx, violationCount, banPlayer) => {
      TABLES.config.set("nuker_data", {
        violationCount: violationCount,
        banPlayer: banPlayer,
      });
      player.tell(`Updated Nuker Protection settings!`);
    });
}
