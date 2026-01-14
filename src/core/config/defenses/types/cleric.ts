import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const clericDefense: DefenseType = {
      id: DEFENSE_IDS.cleric,
      name: "Cleric Chapel",
      types: ["Divine", "Ranged"],
      cost: 82,
      range: 2.1,
      rate: 1.0,
      damage: 9,
      damageType: "radiant",
      critChance: 0.04,
      critMultiplier: 1.5,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#e6d4a2",
      description: "Radiant bolts sear the unholy.",
    };

export { clericDefense };
