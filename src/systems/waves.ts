import type { GameState, WaveState } from "../core/types";

const startNewWave = (state: GameState) => {
  const waveNumber = state.wave;
  const wave: WaveState = {
    id: crypto.randomUUID(),
    waveNumber,
    spawnTimer: 0.2,
    spawnIndex: 0,
    totalSpawns: 12 + waveNumber * 2,
    remainingEnemies: 0,
  };
  state.waves.push(wave);
  state.wave += 1;
  return wave;
};

const updateCountdown = (state: GameState, dt: number) => {
  if (!state.isCountingDown) return;
  state.countdownRemaining -= dt;
  if (state.countdownRemaining <= 0) {
    state.isCountingDown = false;
    state.countdownRemaining = 0;
  }
};

const updateWaves = (
  state: GameState,
  dt: number,
  spawnEnemy: (wave: WaveState) => void,
  onWaveComplete: () => void,
) => {
  for (let i = state.waves.length - 1; i >= 0; i -= 1) {
    const wave = state.waves[i];
    wave.spawnTimer -= dt;
    if (wave.spawnTimer <= 0 && wave.spawnIndex < wave.totalSpawns) {
      spawnEnemy(wave);
      wave.spawnIndex += 1;
      wave.spawnTimer = 0.7;
    }
    if (wave.spawnIndex >= wave.totalSpawns && wave.remainingEnemies <= 0) {
      state.waves.splice(i, 1);
      state.gold += 40;
      onWaveComplete();
    }
  }
};

export { startNewWave, updateCountdown, updateWaves };
