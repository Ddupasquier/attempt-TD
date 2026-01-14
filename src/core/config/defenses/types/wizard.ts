import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const wizardDefense: DefenseType = {
      id: DEFENSE_IDS.wizard,
      name: "Wizard's Tower",
      types: ["Arcane", "Ranged"],
      cost: 85,
      range: 2.1,
      rate: 1.0,
      damage: 12,
      damageType: "force",
      critChance: 0.05,
      critMultiplier: 1.6,
      knockback: 0,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#7fd1b9",
      description: "Arcane bolts and precise spellfire.",
    };

export { wizardDefense };
