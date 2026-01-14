import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const barbarianDefense: DefenseType = {
      id: DEFENSE_IDS.barbarian,
      name: "Barbarian Warcamp",
      types: ["Martial", "Melee"],
      cost: 90,
      range: 1.35,
      rate: 1.2,
      damage: 18,
      damageType: "slashing",
      critChance: 0.03,
      critMultiplier: 1.5,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#c77a4a",
      description: "Frenzied strikes that batter the front line.",
    };

export { barbarianDefense };
