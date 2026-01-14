import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const rogueDefense: DefenseType = {
      id: DEFENSE_IDS.rogue,
      name: "Rogue Hideout",
      types: ["Martial", "Melee"],
      cost: 78,
      range: 1.45,
      rate: 0.65,
      damage: 8,
      damageType: "piercing",
      critChance: 0.14,
      critMultiplier: 1.9,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#7a6f86",
      description: "Precise strikes with deadly criticals.",
    };

export { rogueDefense };
