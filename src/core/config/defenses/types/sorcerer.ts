import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const sorcererDefense: DefenseType = {
      id: DEFENSE_IDS.sorcerer,
      name: "Sorcerer Spire",
      types: ["Arcane", "Ranged"],
      cost: 110,
      range: 2.5,
      rate: 1.4,
      damage: 18,
      damageType: "fire",
      critChance: 0.04,
      critMultiplier: 1.7,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#e6765f",
      description: "Raw elemental bursts scorch foes.",
    };

export { sorcererDefense };
