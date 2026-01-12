import type { PixelSprite, TowerType } from "../core/types";
import type { UiState } from "./uiStateTypes";
import type { Writable } from "svelte/store";

type UiRootProps = {
  uiState: Writable<UiState>;
  towerTypes: TowerType[];
  towerSprites: Record<string, PixelSprite>;
  onStartWave: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onToggleSpeed: () => void;
  onSelectTower: (towerId: string | null) => void;
  onStartDragTower: (towerId: string) => void;
  onUpgradeTower: (towerId: string) => void;
  onCloseTowerPopup: () => void;
  onDefeatReset: () => void;
};

export type { UiRootProps };
