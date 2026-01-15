import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const militiaDefense: DefenseType = {
      id: DEFENSE_IDS.militia,
      name: "Militia Post",
      types: ["Martial", "Ranged"],
      cost: 30,
      range: 1.8,
      rate: 0.72,
      damage: 8,
      damageType: "piercing",
      critChance: 0,
      critMultiplier: 1.5,
      knockback: 0,
      levelStatsOverrides: [
        { damageMult: 1, rangeMult: 1, rateMult: 1, knockbackMult: 1 },
        { damageMult: 1, rangeMult: 1, rateMult: 0.97, knockbackMult: 1 },
        { damageMult: 1, rangeMult: 1, rateMult: 0.94, knockbackMult: 1 },
        { damageMult: 1, rangeMult: 1, rateMult: 0.92, knockbackMult: 1 },
      ],
      levelDamageBonuses: [0, 2, 3, 4],
      onHitSlow: {
        minLevel: 3,
        multiplier: 0.9,
        duration: 0.7,
      },
      damageResistances: {},
      damageGroupResistances: {},
      color: "#8a7b5a",
      description: "Quick early volleys with a minor slow at mastery.",
    };

export { militiaDefense };
