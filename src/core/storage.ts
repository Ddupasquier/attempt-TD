import type { GameState, SaveData } from "./types";

const STORAGE_KEY = "fantasy-td-save";

const saveGame = (state: GameState) => {
  const data: SaveData = {
    gold: state.gold,
    lives: state.lives,
    wave: state.wave,
    soundEnabled: state.soundEnabled,
    selectedTowerId: state.selectedTower ? state.selectedTower.id : null,
    towers: state.towers.map((tower) => ({
      col: tower.col,
      row: tower.row,
      typeId: tower.type.id,
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadGame = (): SaveData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveData;
  } catch (error) {
    console.warn("Failed to load save", error);
    return null;
  }
};

export { loadGame, saveGame };
