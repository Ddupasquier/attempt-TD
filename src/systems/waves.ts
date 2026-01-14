import type { GameState, WaveState } from "../types/core/types";
import { GAME_CONFIG } from "../core/config";

const startNewWave = (state: GameState) => {
  const waveNumber = state.wave;
  const wave: WaveState = {
    id: crypto.randomUUID(),
    waveNumber,
    spawnTimer: GAME_CONFIG.wave.initialSpawnDelay,
    spawnIndex: 0,
    totalSpawns: GAME_CONFIG.wave.baseSpawns + waveNumber * GAME_CONFIG.wave.spawnsPerWave,
    remainingFoes: 0,
    bossSpawned: false,
    hpLost: false,
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
  spawnFoe: (wave: WaveState) => void,
  spawnBossFoe: (wave: WaveState) => void,
  isBossWave: (waveNumber: number) => boolean,
  onWaveComplete: () => void,
) => {
  for (let i = state.waves.length - 1; i >= 0; i -= 1) {
    const wave = state.waves[i];
    if (!wave.bossSpawned && isBossWave(wave.waveNumber)) {
      spawnBossFoe(wave);
      wave.bossSpawned = true;
    }
    wave.spawnTimer -= dt;
    if (wave.spawnTimer <= 0 && wave.spawnIndex < wave.totalSpawns) {
      spawnFoe(wave);
      wave.spawnIndex += 1;
      wave.spawnTimer = GAME_CONFIG.wave.spawnInterval;
    }
    if (wave.spawnIndex >= wave.totalSpawns && wave.remainingFoes <= 0) {
      if (!wave.hpLost) {
        const hpGain = isBossWave(wave.waveNumber)
          ? GAME_CONFIG.gameplay.bossFlawlessHpGain
          : GAME_CONFIG.gameplay.flawlessHpGain;
        state.hp = Math.min(state.maxHp, state.hp + hpGain);
      }
      state.waves.splice(i, 1);
      state.gold += GAME_CONFIG.wave.waveReward;
      onWaveComplete();
    }
  }
};

export { startNewWave, updateCountdown, updateWaves };
