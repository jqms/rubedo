import { Player } from "@minecraft/server";
import { ActionForm } from "../../../../lib/Form/Models/ActionForm";
import { ModalForm } from "../../../../lib/Form/Models/ModelForm";
import { getConfigId, setConfigId } from "../../utils";

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
  const spam_config = getConfigId("spam_config");
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
        setConfigId("spam_config", {
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
  const cbe_data = getConfigId("cbe_config");
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
    .addToggle(
      "Allow non-enchantable items to be enchanted",
      cbe_data.banPlayer
    )
    .show(
      player,
      (ctx, clearItem, violationCount, banPlayer, canAddEnchantment) => {
        setConfigId("cbe_config", {
          clearItem: clearItem,
          violationCount: violationCount,
          banPlayer: banPlayer,
          canAddEnchantment: canAddEnchantment,
        })
        player.tell(`Updated CBE Protection settings!`);
      }
    );
}

export function showPage4(player: Player) {
  const gamemode_data = getConfigId("gamemode_config");
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
        setConfigId("gamemode_config", {
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
  const nuker_data = getConfigId("nuker_data");
  new ModalForm("Manage Nuker Protection")
    .addSlider(
      "Violation Count before ban (if ban is false this does nothing)",
      0,
      20,
      1,
      nuker_data.violationCount
    )
    .addToggle("Ban Player", nuker_data.banPlayer)
    .show(player, (ctx, violationCount, banPlayer) => {
      setConfigId("nuker_data", {
        violationCount: violationCount,
        banPlayer: banPlayer,
      });
      player.tell(`Updated Nuker Protection settings!`);
    });
}
