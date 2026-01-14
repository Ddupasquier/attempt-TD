import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const fighterDefense: DefenseType = {
      id: DEFENSE_IDS.fighter,
      name: "Fighter Barracks",
      types: ["Martial", "Melee"],
      cost: 60,
      range: 1.3,
      rate: 0.6,
      damage: 9,
      damageType: "slashing",
      critChance: 0.04,
      critMultiplier: 1.6,
      knockback: 0.08,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#b2896b",
      description: "Reliable blows from seasoned warriors.",
    };

export { fighterDefense };
