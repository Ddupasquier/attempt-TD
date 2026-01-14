import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const siegeEngineDefense: DefenseType = {
      id: DEFENSE_IDS.siegeEngine,
      name: "Siege Engine",
      types: ["Martial", "Ranged"],
      cost: 220,
      range: 4.5,
      rate: 4.5,
      damage: 55,
      damageType: "bludgeoning",
      critChance: 0.03,
      critMultiplier: 1.8,
      knockback: 0,
      splashRadiusTiles: 1,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#6b6b6b",
      description: "Hurls massive stones at a fixed target.",
    };

export { siegeEngineDefense };
