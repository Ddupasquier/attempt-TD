import type { PixelSprite, TowerType, TrapType } from "../core/types";
import type { UiState } from "./uiStateTypes";
import type { Writable } from "svelte/store";

type UiRootProps = {
  uiState: Writable<UiState>;
  towerTypes: TowerType[];
  towerSprites: Record<string, PixelSprite>;
  trapTypes: TrapType[];
  trapSprites: Record<string, PixelSprite>;
  onStartWave: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onToggleDamagePopups: () => void;
  onToggleSpeed: () => void;
  onSelectTower: (towerId: string | null) => void;
  onStartDragTower: (towerId: string) => void;
  onStartDragTrap: (trapId: string) => void;
  onUpgradeTower: (towerId: string) => void;
  onDeleteTower: (towerId: string) => void;
  onSetTowerTarget: (towerId: string) => void;
  onCloseTowerPopup: () => void;
  onDefeatReset: () => void;
};

export type { UiRootProps };
