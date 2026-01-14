import type { DefenseType } from "../../../types/core/types";
import type { DefenseLevelCostScale, DefenseLevelStats } from "../../../types/core/configTypes";
import { barbarianDefense } from "./types/barbarian";
import { bardDefense } from "./types/bard";
import { clericDefense } from "./types/cleric";
import { druidDefense } from "./types/druid";
import { wizardDefense } from "./types/wizard";
import { monkDefense } from "./types/monk";
import { rangerDefense } from "./types/ranger";
import { rogueDefense } from "./types/rogue";
import { sorcererDefense } from "./types/sorcerer";
import { warlockDefense } from "./types/warlock";
import { fighterDefense } from "./types/fighter";
import { paladinDefense } from "./types/paladin";
import { siegeEngineDefense } from "./types/siegeEngine";
import { militiaDefense } from "./types/militia";

const DEFENSE_CONFIG = {
  minRange: 1.3,
  maxLevel: 3,
  levelStats: [
    { damageMult: 1, rangeMult: 1, rateMult: 1, knockbackMult: 1 },
    { damageMult: 1.2, rangeMult: 1.1, rateMult: 0.92, knockbackMult: 1.1 },
    { damageMult: 1.4, rangeMult: 1.2, rateMult: 0.85, knockbackMult: 1.2 },
    { damageMult: 1.7, rangeMult: 1.3, rateMult: 0.78, knockbackMult: 1.3 },
  ],
  levelCosts: [
    { level: 1, costMultiplier: 1.2 },
    { level: 2, costMultiplier: 1.6 },
    { level: 3, costMultiplier: 2.1 },
  ],
  types: [
    militiaDefense,
    barbarianDefense,
    bardDefense,
    clericDefense,
    druidDefense,
    wizardDefense,
    monkDefense,
    rangerDefense,
    rogueDefense,
    sorcererDefense,
    warlockDefense,
    fighterDefense,
    paladinDefense,
    siegeEngineDefense,
  ],
} satisfies {
  minRange: number;
  maxLevel: number;
  levelStats: DefenseLevelStats[];
  levelCosts: DefenseLevelCostScale[];
  types: DefenseType[];
};

export { DEFENSE_CONFIG };
