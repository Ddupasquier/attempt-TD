import { DEFENSE_IDS } from "../../constants/defenseIds";
import type { PixelSprite } from "../../types/core/types";
import { barbarianSprite } from "./defenses/barbarian";
import { bardSprite } from "./defenses/bard";
import { clericSprite } from "./defenses/cleric";
import { druidSprite } from "./defenses/druid";
import { wizardSprite } from "./defenses/wizard";
import { rangerSprite } from "./defenses/ranger";
import { fighterSprite } from "./defenses/fighter";
import { paladinSprite } from "./defenses/paladin";
import { monkSprite } from "./defenses/monk";
import { rogueSprite } from "./defenses/rogue";
import { sorcererSprite } from "./defenses/sorcerer";
import { warlockSprite } from "./defenses/warlock";
import { siegeEngineSprite } from "./defenses/siegeEngine";
import { militiaSprite } from "./defenses/militia";

const defenseSprites: Record<string, PixelSprite> = {
  [DEFENSE_IDS.barbarian]: barbarianSprite,
  [DEFENSE_IDS.bard]: bardSprite,
  [DEFENSE_IDS.cleric]: clericSprite,
  [DEFENSE_IDS.druid]: druidSprite,
  [DEFENSE_IDS.wizard]: wizardSprite,
  [DEFENSE_IDS.ranger]: rangerSprite,
  [DEFENSE_IDS.fighter]: fighterSprite,
  [DEFENSE_IDS.paladin]: paladinSprite,
  [DEFENSE_IDS.monk]: monkSprite,
  [DEFENSE_IDS.rogue]: rogueSprite,
  [DEFENSE_IDS.sorcerer]: sorcererSprite,
  [DEFENSE_IDS.warlock]: warlockSprite,
  [DEFENSE_IDS.militia]: militiaSprite,
  [DEFENSE_IDS.siegeEngine]: siegeEngineSprite,
};

export { defenseSprites };
