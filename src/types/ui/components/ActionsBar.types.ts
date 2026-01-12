type ActionsBarProps = {
  isCountingDown: boolean;
  countdownRemaining: number;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
  showDamagePopups: boolean;
  speedMultiplier: number;
  onStartWave: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onToggleDamagePopups: () => void;
  onToggleSpeed: () => void;
};

export type { ActionsBarProps };
