import type { GameState, WaveState } from "../types/core/types";
import { pathPoints } from "../core/data";
import { GAME_CONFIG, getFactionForWave } from "../core/config";
import type { EnemyType } from "../types/core/types";

const isBossWave = (waveNumber: number) => waveNumber % GAME_CONFIG.enemy.bossInterval === 0;

const getFactionWaveIndex = (waveNumber: number) =>
  ((waveNumber - 1) % GAME_CONFIG.enemy.bossInterval) + 1;

const pickEnemyType = (wave: WaveState, factionId: string): EnemyType => {
  const factionWave = getFactionWaveIndex(wave.waveNumber);
  const factionWeights = GAME_CONFIG.enemy.typeSpawnWeightsByFaction[factionId as keyof typeof GAME_CONFIG.enemy.typeSpawnWeightsByFaction];
  const weightsTable = factionWeights ?? GAME_CONFIG.enemy.typeSpawnWeights;
  const config =
    weightsTable.find((entry) => factionWave <= entry.maxWave) ?? weightsTable[weightsTable.length - 1];
  const candidates = Object.entries(config.weights)
    .filter(([, weight]) => typeof weight === "number" && weight > 0)
    .map(([type, weight]) => ({ type: type as EnemyType, weight: weight as number }));
  const total = candidates.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of candidates) {
    roll -= entry.weight;
    if (roll <= 0) return entry.type;
  }
  return "raider";
};

const spawnEnemy = (state: GameState, wave: WaveState) => {
  const hp = GAME_CONFIG.enemy.baseHp + wave.waveNumber * GAME_CONFIG.enemy.hpPerWave;
  const speed = GAME_CONFIG.enemy.baseSpeed + wave.waveNumber * GAME_CONFIG.enemy.speedPerWave;
  const faction = getFactionForWave(wave.waveNumber);
  const type = pickEnemyType(wave, faction.id);
  const typeStats = GAME_CONFIG.enemy.types[type];
  state.enemies.push({
    id: crypto.randomUUID(),
    hp: Math.round(hp * typeStats.hpMultiplier),
    maxHp: Math.round(hp * typeStats.hpMultiplier),
    speed: speed * typeStats.speedMultiplier,
    waveId: wave.id,
    faction: faction.id,
    type,
    targetIndex: 1,
    sizeScale: typeStats.sizeScale,
  });
  wave.remainingEnemies += 1;
};

const spawnBossEnemy = (state: GameState, wave: WaveState) => {
  const baseHp = GAME_CONFIG.enemy.baseHp + wave.waveNumber * GAME_CONFIG.enemy.hpPerWave;
  const baseSpeed = GAME_CONFIG.enemy.baseSpeed + wave.waveNumber * GAME_CONFIG.enemy.speedPerWave;
  const faction = getFactionForWave(wave.waveNumber);
  state.enemies.push({
    id: crypto.randomUUID(),
    hp: Math.round(baseHp * GAME_CONFIG.enemy.bossHpMultiplier),
    maxHp: Math.round(baseHp * GAME_CONFIG.enemy.bossHpMultiplier),
    speed: baseSpeed * GAME_CONFIG.enemy.bossSpeedMultiplier,
    waveId: wave.id,
    faction: faction.id,
    type: "boss",
    targetIndex: 1,
    isBoss: true,
    sizeScale: GAME_CONFIG.enemy.bossScale,
  });
  wave.remainingEnemies += 1;
};

const updateEnemies = (
  state: GameState,
  dt: number,
  size: number,
  onStateChange: () => void,
) => {
  const turnStrength = 10;

  const getWaypoint = (index: number) => ({
    x: pathPoints[index].x * size + size * 0.5,
    y: pathPoints[index].y * size + size * 0.5,
  });

  for (const enemy of state.enemies) {
    if (enemy.x === undefined || enemy.y === undefined) {
      const start = getWaypoint(0);
      enemy.x = start.x;
      enemy.y = start.y;
      enemy.vx = 1;
      enemy.vy = 0;
    }
    const next = pathPoints[enemy.targetIndex];
    if (!next) {
      enemy.reachedEnd = true;
      continue;
    }
    const target = getWaypoint(enemy.targetIndex);
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.hypot(dx, dy);
    if (dist < size * 0.2) {
      enemy.targetIndex += 1;
    }
    const desiredX = dist === 0 ? 0 : dx / dist;
    const desiredY = dist === 0 ? 0 : dy / dist;
    enemy.vx = (enemy.vx ?? desiredX) + (desiredX - (enemy.vx ?? 0)) * Math.min(turnStrength * dt, 1);
    enemy.vy = (enemy.vy ?? desiredY) + (desiredY - (enemy.vy ?? 0)) * Math.min(turnStrength * dt, 1);
    const speed = enemy.speed * size;
    enemy.x += (enemy.vx ?? 0) * speed * dt;
    enemy.y += (enemy.vy ?? 0) * speed * dt;

    const knockbackMagnitude = Math.hypot(enemy.knockbackX ?? 0, enemy.knockbackY ?? 0);
    if (knockbackMagnitude > 0.001) {
      enemy.x += (enemy.knockbackX ?? 0) * dt;
      enemy.y += (enemy.knockbackY ?? 0) * dt;
      const decay = Math.pow(0.001, dt);
      enemy.knockbackX = (enemy.knockbackX ?? 0) * decay;
      enemy.knockbackY = (enemy.knockbackY ?? 0) * decay;
    } else {
      enemy.knockbackX = 0;
      enemy.knockbackY = 0;
    }
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.reachedEnd) {
      state.enemies.splice(i, 1);
      state.lives -= 1;
      const wave = state.waves.find((item) => item.id === enemy.waveId);
      if (wave) {
        wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
      }
      onStateChange();
    } else if (enemy.hp <= 0) {
      state.enemies.splice(i, 1);
      state.gold += 8;
      const wave = state.waves.find((item) => item.id === enemy.waveId);
      if (wave) {
        wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
      }
      onStateChange();
    }
  }
};

export { isBossWave, spawnBossEnemy, spawnEnemy, updateEnemies };
