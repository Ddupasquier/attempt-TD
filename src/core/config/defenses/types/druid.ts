import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const druidDefense: DefenseType = {
      id: DEFENSE_IDS.druid,
      name: "Druid Grove",
      types: ["Primal", "Ranged"],
      cost: 80,
      range: 2.4,
      rate: 0.85,
      damage: 7,
      damageType: "poison",
      critChance: 0.04,
      critMultiplier: 1.4,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#79a96c",
      description: "Nature's wrath seeps into enemies.",
    };

export { druidDefense };
