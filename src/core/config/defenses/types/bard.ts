import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const bardDefense: DefenseType = {
      id: DEFENSE_IDS.bard,
      name: "Bard College",
      types: ["Arcane", "Ranged"],
      cost: 85,
      range: 2.1,
      rate: 0.75,
      damage: 0,
      damageType: "thunder",
      critChance: 0.06,
      critMultiplier: 1.4,
      knockback: 0,
      auraRangeTiles: 2.5,
      auraBonuses: {
        damageMult: 1.12,
        rangeMult: 1.1,
        rateMult: 0.9,
      },
      damageResistances: {},
      damageGroupResistances: {},
      color: "#b58ad6",
      description: "Inspiring melodies bolster nearby allies.",
    };

export { bardDefense };
