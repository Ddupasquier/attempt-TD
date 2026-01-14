import type { GameConfig } from "../../types/core/configTypes";
import { FOE_CONFIG } from "./foes";
import { FACTION_PROGRESSION, getFactionForWave } from "./factions";
import { GAMEPLAY_CONFIG, GRID_CONFIG } from "./game";
import { SPELL_SCROLL_CONFIG } from "./spellScrolls";
import { DEFENSE_CONFIG } from "./defenses";
import { WAVE_CONFIG } from "./waves";

const GAME_CONFIG: GameConfig = {
  grid: GRID_CONFIG,
  gameplay: GAMEPLAY_CONFIG,
  defenseTypes: DEFENSE_CONFIG.types,
  defense: {
    minRange: DEFENSE_CONFIG.minRange,
  },
  spellScrollTypes: SPELL_SCROLL_CONFIG.types,
  maxDefenseLevel: DEFENSE_CONFIG.maxLevel,
  defenseLevelStats: DEFENSE_CONFIG.levelStats,
  defenseLevelCosts: DEFENSE_CONFIG.levelCosts,
  wave: WAVE_CONFIG,
  foe: FOE_CONFIG,
};

export {
  DEFENSE_CONFIG,
  FACTION_PROGRESSION,
  FOE_CONFIG,
  GAME_CONFIG,
  GRID_CONFIG,
  GAMEPLAY_CONFIG,
  SPELL_SCROLL_CONFIG,
  WAVE_CONFIG,
  getFactionForWave,
};
