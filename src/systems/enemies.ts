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

  const clampIndex = (index: number) => Math.max(0, Math.min(index, pathPoints.length - 1));
  const getWaypoint = (index: number) => {
    const point = pathPoints[clampIndex(index)];
    return {
      x: point.x * size + size * 0.5,
      y: point.y * size + size * 0.5,
    };
  };

  const getPathDirection = (targetIndex: number, fallbackX: number, fallbackY: number) => {
    const prevIndex = Math.max(0, targetIndex - 1);
    const prev = getWaypoint(prevIndex);
    const next = getWaypoint(targetIndex);
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy);
    if (len <= 0.001) {
      return { x: fallbackX, y: fallbackY };
    }
    return { x: dx / len, y: dy / len };
  };

  const clampToPathSegment = (enemy: typeof state.enemies[number]) => {
    const prevIndex = Math.max(0, enemy.targetIndex - 1);
    const prev = getWaypoint(prevIndex);
    const next = getWaypoint(enemy.targetIndex);
    const segX = next.x - prev.x;
    const segY = next.y - prev.y;
    const segLenSq = segX * segX + segY * segY;
    if (segLenSq <= 0.001 || enemy.x === undefined || enemy.y === undefined) return;
    const px = enemy.x - prev.x;
    const py = enemy.y - prev.y;
    const t = Math.max(0, Math.min(1, (px * segX + py * segY) / segLenSq));
    enemy.x = prev.x + segX * t;
    enemy.y = prev.y + segY * t;
  };

  for (const enemy of state.enemies) {
    if ((enemy.knockbackResistRemaining ?? 0) > 0) {
      enemy.knockbackResistRemaining = Math.max(0, (enemy.knockbackResistRemaining ?? 0) - dt);
    }
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
      if (enemy.targetIndex >= pathPoints.length) {
        enemy.reachedEnd = true;
        continue;
      }
    }
    const desiredX = dist === 0 ? 0 : dx / dist;
    const desiredY = dist === 0 ? 0 : dy / dist;
    enemy.vx = (enemy.vx ?? desiredX) + (desiredX - (enemy.vx ?? 0)) * Math.min(turnStrength * dt, 1);
    enemy.vy = (enemy.vy ?? desiredY) + (desiredY - (enemy.vy ?? 0)) * Math.min(turnStrength * dt, 1);
    const speed = enemy.speed * size;
    enemy.x += (enemy.vx ?? 0) * speed * dt;
    enemy.y += (enemy.vy ?? 0) * speed * dt;

    const legacyKnockback = Math.hypot(enemy.knockbackX ?? 0, enemy.knockbackY ?? 0);
    let knockbackRemaining = Math.max(enemy.knockbackRemaining ?? 0, legacyKnockback);
    if (knockbackRemaining > 0.001) {
      clampToPathSegment(enemy);
      const pathDir = getPathDirection(enemy.targetIndex, desiredX, desiredY);
      const step = Math.min(knockbackRemaining, size * 8 * dt);
      enemy.x -= pathDir.x * step;
      enemy.y -= pathDir.y * step;
      clampToPathSegment(enemy);
      if (enemy.targetIndex > 0) {
        const prev = getWaypoint(enemy.targetIndex - 1);
        const next = getWaypoint(enemy.targetIndex);
        const segX = next.x - prev.x;
        const segY = next.y - prev.y;
        const segLenSq = segX * segX + segY * segY;
        if (segLenSq > 0.001) {
          const px = (enemy.x ?? prev.x) - prev.x;
          const py = (enemy.y ?? prev.y) - prev.y;
          const t = (px * segX + py * segY) / segLenSq;
          if (t <= 0.02) {
            enemy.targetIndex -= 1;
          }
        }
      }
      knockbackRemaining = Math.max(0, knockbackRemaining - step);
      enemy.knockbackRemaining = knockbackRemaining;
      enemy.knockbackX = 0;
      enemy.knockbackY = 0;
    } else {
      enemy.knockbackRemaining = 0;
      enemy.knockbackX = 0;
      enemy.knockbackY = 0;
    }
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.reachedEnd) {
      state.enemies.splice(i, 1);
      const lifeLoss = enemy.type === "boss" || enemy.isBoss ? 3 : 1;
      state.lives = Math.max(0, state.lives - lifeLoss);
      const wave = state.waves.find((item) => item.id === enemy.waveId);
      if (wave) {
        wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
        wave.livesLost = true;
      }
      onStateChange();
    } else if (enemy.hp <= 0) {
      state.enemies.splice(i, 1);
      state.gold += 6;
      const wave = state.waves.find((item) => item.id === enemy.waveId);
      if (wave) {
        wave.remainingEnemies = Math.max(0, wave.remainingEnemies - 1);
      }
      onStateChange();
    }
  }
};

export { isBossWave, spawnBossEnemy, spawnEnemy, updateEnemies };
