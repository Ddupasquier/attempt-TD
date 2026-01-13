import type { GameState } from "../types/core/types";
import { GAME_CONFIG } from "./config";

const createInitialState = (): GameState => ({
  gold: GAME_CONFIG.gameplay.startingGold,
  lives: GAME_CONFIG.gameplay.startingLives,
  maxLives: GAME_CONFIG.gameplay.maxLives,
  wave: GAME_CONFIG.gameplay.startingWave,
  towers: [],
  traps: [],
  enemies: [],
  projectiles: [],
  effects: [],
  damagePopups: [],
  selectedTower: null,
  waves: [],
  isCountingDown: false,
  countdownRemaining: 0,
  elapsed: 0,
  soundEnabled: true,
  autoWaveEnabled: false,
  showDamagePopups: true,
});

export { createInitialState };
