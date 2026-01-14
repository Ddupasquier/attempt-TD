type UiState = {
  selectedDefenseTypeId: string | null;
  selectedDefensePopup: DefenseUpgradePopup | null;
  gold: number;
  hp: number;
  wave: number;
  foeFactionName: string;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
  showDamagePopups: boolean;
  spellScrollCooldowns: Record<string, number>;
  speedMultiplier: number;
  isCountingDown: boolean;
  countdownRemaining: number;
  showDefeat: boolean;
  isDragging: boolean;
  mapWidth: number;
  mapHeight: number;
};

type DefenseUpgradePopup = {
  id: string;
  typeId: string;
  name: string;
  level: number;
  maxLevel: number;
  targetCol?: number;
  targetRow?: number;
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

export type { DefenseUpgradePopup, UiState };
