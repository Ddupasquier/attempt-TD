import type { GameState } from "../types/core/types";
import { GAME_CONFIG } from "./config";

const createInitialState = (): GameState => ({
  gold: GAME_CONFIG.gameplay.startingGold,
  hp: GAME_CONFIG.gameplay.startingHp,
  maxHp: GAME_CONFIG.gameplay.maxHp,
  wave: GAME_CONFIG.gameplay.startingWave,
  defenses: [],
  spellScrolls: [],
  spellScrollCooldowns: {},
  foes: [],
  projectiles: [],
  effects: [],
  damagePopups: [],
  selectedDefense: null,
  waves: [],
  isCountingDown: false,
  countdownRemaining: 0,
  elapsed: 0,
  soundEnabled: true,
  autoWaveEnabled: false,
  showDamagePopups: true,
});

export { createInitialState };
