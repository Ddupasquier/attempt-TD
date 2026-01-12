import type { GameConfig } from "../../types/core/configTypes";
import { ENEMY_CONFIG } from "./enemies";
import { FACTION_PROGRESSION, getFactionForWave } from "./factions";
import { GRID_CONFIG } from "./game";
import { TOWER_CONFIG } from "./towers";
import { WAVE_CONFIG } from "./waves";

const GAME_CONFIG: GameConfig = {
  grid: GRID_CONFIG,
  towerTypes: TOWER_CONFIG.types,
  tower: {
    minRange: TOWER_CONFIG.minRange,
  },
  maxTowerLevel: TOWER_CONFIG.maxLevel,
  towerLevelStats: TOWER_CONFIG.levelStats,
  towerLevelCosts: TOWER_CONFIG.levelCosts,
  wave: WAVE_CONFIG,
  enemy: ENEMY_CONFIG,
};

export {
  ENEMY_CONFIG,
  FACTION_PROGRESSION,
  GAME_CONFIG,
  GRID_CONFIG,
  TOWER_CONFIG,
  WAVE_CONFIG,
  getFactionForWave,
};
