import type { GameState } from "../types/core/types";

const createInitialState = (): GameState => ({
  gold: 140,
  lives: 15,
  maxLives: 15,
  wave: 1,
  towers: [],
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
