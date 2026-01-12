type ActionsBarProps = {
  isCountingDown: boolean;
  countdownRemaining: number;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
  speedMultiplier: number;
  onStartWave: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onToggleSpeed: () => void;
};

export type { ActionsBarProps };
