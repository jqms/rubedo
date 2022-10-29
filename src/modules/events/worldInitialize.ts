import {
  DynamicPropertiesDefinition,
  EntityTypes,
  MinecraftEntityTypes,
  world,
} from "@minecraft/server";
import { ENTITY_IDENTIFER } from "../../config/database";
import { OBJECTIVES } from "../../config/objectives";
import { runCommand } from "../../utils";

world.events.worldInitialize.subscribe(({ propertyRegistry }) => {
  /**
   * Loads Ticking Area
   */
  runCommand(`tickingarea add 0 0 0 0 0 0 db true`);

  let def = new DynamicPropertiesDefinition();
  def.defineString("name", 30);
  def.defineNumber("index");
  propertyRegistry.registerEntityTypeDynamicProperties(
    def,
    EntityTypes.get(ENTITY_IDENTIFER)
  );

  let def2 = new DynamicPropertiesDefinition();
  def2.defineString("role", 30);
  propertyRegistry.registerEntityTypeDynamicProperties(
    def2,
    MinecraftEntityTypes.player
  );

  let def3 = new DynamicPropertiesDefinition();
  def3.defineBoolean("roleHasBeenSet");
  def3.defineString("worldsOwner", 100);
  propertyRegistry.registerWorldDynamicProperties(def3);

  for (const obj of OBJECTIVES) {
    world.scoreboard.addObjective(obj.objective, obj.displayName ?? "");
  }
});
