import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const warlockDefense: DefenseType = {
      id: DEFENSE_IDS.warlock,
      name: "Warlock Sanctum",
      types: ["Arcane", "Ranged"],
      cost: 95,
      range: 2.35,
      rate: 1.1,
      damage: 13,
      damageType: "necrotic",
      critChance: 0.05,
      critMultiplier: 1.7,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#7b5cc2",
      description: "Eldritch power with sinister reach.",
    };

export { warlockDefense };
