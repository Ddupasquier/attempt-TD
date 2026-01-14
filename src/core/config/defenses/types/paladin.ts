import type { DefenseType } from "../../../../types/core/types";
import { DEFENSE_IDS } from "../../../../constants/defenseIds";

const paladinDefense: DefenseType = {
      id: DEFENSE_IDS.paladin,
      name: "Paladin Bastion",
      types: ["Divine", "Melee"],
      cost: 105,
      range: 1.35,
      rate: 1.1,
      damage: 16,
      damageType: "radiant",
      critChance: 0.04,
      critMultiplier: 1.5,
      knockback: 0.26,
      damageResistances: {},
      damageGroupResistances: {},
      color: "#f4d38e",
      description: "Holy bulwark that staggers foes.",
    };

export { paladinDefense };
