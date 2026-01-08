import { writable, type Writable } from "svelte/store";

type UiState = {
  selectedTowerTypeId: string | null;
  gold: number;
  lives: number;
  wave: number;
  enemyFactionName: string;
  soundEnabled: boolean;
  isCountingDown: boolean;
  countdownRemaining: number;
  showDefeat: boolean;
  isDragging: boolean;
};

const createUiState = (initial: UiState): Writable<UiState> => writable(initial);

export { type UiState, createUiState };
