import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const monkDefense: DefenseType = {
      id: DEFENSE_IDS.monk,
      name: "Monk Dojo",
      types: ["Martial", "Melee"],
      cost: 65,
      range: 1.3,
      rate: 0.4,
      damage: 4,
      damageType: "bludgeoning",
      critChance: 0.04,
      critMultiplier: 1.4,
      knockback: 0.18,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#d2a85c",
      description: "Blindingly fast strikes at close range.",
    };

export { monkDefense };
