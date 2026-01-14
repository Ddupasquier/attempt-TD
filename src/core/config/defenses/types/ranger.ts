import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const rangerDefense: DefenseType = {
      id: DEFENSE_IDS.ranger,
      name: "Ranger Outpost",
      types: ["Martial", "Ranged"],
      cost: 62,
      range: 2.6,
      rate: 0.7,
      damage: 7,
      damageType: "piercing",
      critChance: 0.07,
      critMultiplier: 1.5,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#e7c27d",
      description: "Rapid volleys from trained hunters.",
    };

export { rangerDefense };
