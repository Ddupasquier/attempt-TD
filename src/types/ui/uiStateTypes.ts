type UiState = {
  selectedTowerTypeId: string | null;
  selectedTowerPopup: TowerUpgradePopup | null;
  gold: number;
  lives: number;
  wave: number;
  enemyFactionName: string;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
  speedMultiplier: number;
  isCountingDown: boolean;
  countdownRemaining: number;
  showDefeat: boolean;
  isDragging: boolean;
};

type TowerUpgradePopup = {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  x: number;
  y: number;
  canUpgrade: boolean;
  canAfford: boolean;
  upgradeCost: number;
  statsCurrent: {
    damage: number;
    range: number;
    rate: number;
    knockback: number;
  };
  statsNext: {
    damage: number;
    range: number;
    rate: number;
    knockback: number;
  } | null;
};

export type { TowerUpgradePopup, UiState };
