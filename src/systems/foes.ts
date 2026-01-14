import type { GameState, WaveState, FoeType } from "../types/core/types";
import { pathPoints } from "../core/data";
import { GAME_CONFIG, getFactionForWave } from "../core/config";
import { getDevConfig, isDevEnabled } from "../core/devFlags";

const isBossWave = (waveNumber: number) => waveNumber % GAME_CONFIG.foe.bossInterval === 0;

const getFactionWaveIndex = (waveNumber: number) =>
  ((waveNumber - 1) % GAME_CONFIG.foe.bossInterval) + 1;

const pickFoeType = (wave: WaveState, factionId: string): FoeType => {
  const factionWave = getFactionWaveIndex(wave.waveNumber);
  const factionWeights = GAME_CONFIG.foe.typeSpawnWeightsByFaction[factionId as keyof typeof GAME_CONFIG.foe.typeSpawnWeightsByFaction];
  const weightsTable = factionWeights ?? GAME_CONFIG.foe.typeSpawnWeights;
  const config =
    weightsTable.find((entry) => factionWave <= entry.maxWave) ?? weightsTable[weightsTable.length - 1];
  const candidates = Object.entries(config.weights)
    .filter(([, weight]) => typeof weight === "number" && weight > 0)
    .map(([type, weight]) => ({ type: type as FoeType, weight: weight as number }));
  const total = candidates.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of candidates) {
    roll -= entry.weight;
    if (roll <= 0) return entry.type;
  }
  return "raider";
};

const spawnFoe = (state: GameState, wave: WaveState) => {
  const hp = GAME_CONFIG.foe.baseHp + wave.waveNumber * GAME_CONFIG.foe.hpPerWave;
  const speed = GAME_CONFIG.foe.baseSpeed + wave.waveNumber * GAME_CONFIG.foe.speedPerWave;
  const faction = getFactionForWave(wave.waveNumber);
  const type = pickFoeType(wave, faction.id);
  const typeStats = GAME_CONFIG.foe.types[type];
  state.foes.push({
    id: crypto.randomUUID(),
    hp: Math.round(hp * typeStats.hpMultiplier),
    maxHp: Math.round(hp * typeStats.hpMultiplier),
    speed: speed * typeStats.speedMultiplier,
    waveId: wave.id,
    faction: faction.id,
    type,
    targetIndex: 1,
    sizeScale: typeStats.sizeScale,
    damageResistances: typeStats.damageResistances,
    damageGroupResistances: typeStats.damageGroupResistances,
  });
  wave.remainingFoes += 1;
};

const spawnBossFoe = (state: GameState, wave: WaveState) => {
  const baseHp = GAME_CONFIG.foe.baseHp + wave.waveNumber * GAME_CONFIG.foe.hpPerWave;
  const baseSpeed = GAME_CONFIG.foe.baseSpeed + wave.waveNumber * GAME_CONFIG.foe.speedPerWave;
  const faction = getFactionForWave(wave.waveNumber);
  state.foes.push({
    id: crypto.randomUUID(),
    hp: Math.round(baseHp * GAME_CONFIG.foe.bossHpMultiplier),
    maxHp: Math.round(baseHp * GAME_CONFIG.foe.bossHpMultiplier),
    speed: baseSpeed * GAME_CONFIG.foe.bossSpeedMultiplier,
    waveId: wave.id,
    faction: faction.id,
    type: "boss",
    targetIndex: 1,
    isBoss: true,
    sizeScale: GAME_CONFIG.foe.bossScale,
    damageResistances: GAME_CONFIG.foe.bossDamageResistances,
    damageGroupResistances: GAME_CONFIG.foe.bossDamageGroupResistances,
  });
  wave.remainingFoes += 1;
};

const updateFoes = (
  state: GameState,
  dt: number,
  size: number,
  onStateChange: () => void,
) => {
  const turnStrength = GAME_CONFIG.gameplay.foeTurnStrength;

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

  const clampToPathSegment = (foe: typeof state.foes[number]) => {
    const prevIndex = Math.max(0, foe.targetIndex - 1);
    const prev = getWaypoint(prevIndex);
    const next = getWaypoint(foe.targetIndex);
    const segX = next.x - prev.x;
    const segY = next.y - prev.y;
    const segLenSq = segX * segX + segY * segY;
    if (segLenSq <= 0.001 || foe.x === undefined || foe.y === undefined) return;
    const px = foe.x - prev.x;
    const py = foe.y - prev.y;
    const t = Math.max(0, Math.min(1, (px * segX + py * segY) / segLenSq));
    foe.x = prev.x + segX * t;
    foe.y = prev.y + segY * t;
  };

  for (const foe of state.foes) {
    if ((foe.slowRemaining ?? 0) > 0) {
      foe.slowRemaining = Math.max(0, (foe.slowRemaining ?? 0) - dt);
      if (foe.slowRemaining === 0) {
        foe.slowMultiplier = 1;
      }
    }
    if ((foe.knockbackResistRemaining ?? 0) > 0) {
      foe.knockbackResistRemaining = Math.max(0, (foe.knockbackResistRemaining ?? 0) - dt);
    }
    if (foe.x === undefined || foe.y === undefined) {
      const start = getWaypoint(0);
      foe.x = start.x;
      foe.y = start.y;
      foe.vx = 1;
      foe.vy = 0;
    }
    const next = pathPoints[foe.targetIndex];
    if (!next) {
      foe.reachedEnd = true;
      continue;
    }
    const target = getWaypoint(foe.targetIndex);
    const dx = target.x - foe.x;
    const dy = target.y - foe.y;
    const dist = Math.hypot(dx, dy);
    if (dist < size * GAME_CONFIG.gameplay.foeArrivalThreshold) {
      foe.targetIndex += 1;
      if (foe.targetIndex >= pathPoints.length) {
        foe.reachedEnd = true;
        continue;
      }
    }
    const desiredX = dist === 0 ? 0 : dx / dist;
    const desiredY = dist === 0 ? 0 : dy / dist;
    foe.vx = (foe.vx ?? desiredX) + (desiredX - (foe.vx ?? 0)) * Math.min(turnStrength * dt, 1);
    foe.vy = (foe.vy ?? desiredY) + (desiredY - (foe.vy ?? 0)) * Math.min(turnStrength * dt, 1);
    const slowMultiplier = foe.slowMultiplier ?? 1;
    const speed = foe.speed * size * slowMultiplier;
    foe.x += (foe.vx ?? 0) * speed * dt;
    foe.y += (foe.vy ?? 0) * speed * dt;

    const legacyKnockback = Math.hypot(foe.knockbackX ?? 0, foe.knockbackY ?? 0);
    let knockbackRemaining = Math.max(foe.knockbackRemaining ?? 0, legacyKnockback);
    if (knockbackRemaining > 0.001) {
      clampToPathSegment(foe);
      const pathDir = getPathDirection(foe.targetIndex, desiredX, desiredY);
      const step = Math.min(knockbackRemaining, size * GAME_CONFIG.gameplay.knockbackSpeed * dt);
      foe.x -= pathDir.x * step;
      foe.y -= pathDir.y * step;
      clampToPathSegment(foe);
      if (foe.targetIndex > 0) {
        const prev = getWaypoint(foe.targetIndex - 1);
        const next = getWaypoint(foe.targetIndex);
        const segX = next.x - prev.x;
        const segY = next.y - prev.y;
        const segLenSq = segX * segX + segY * segY;
        if (segLenSq > 0.001) {
          const px = (foe.x ?? prev.x) - prev.x;
          const py = (foe.y ?? prev.y) - prev.y;
          const t = (px * segX + py * segY) / segLenSq;
          if (t <= GAME_CONFIG.gameplay.backtrackThreshold) {
            foe.targetIndex -= 1;
          }
        }
      }
      knockbackRemaining = Math.max(0, knockbackRemaining - step);
      foe.knockbackRemaining = knockbackRemaining;
      foe.knockbackX = 0;
      foe.knockbackY = 0;
    } else {
      foe.knockbackRemaining = 0;
      foe.knockbackX = 0;
      foe.knockbackY = 0;
    }
  }

  for (let i = state.foes.length - 1; i >= 0; i -= 1) {
    const foe = state.foes[i];
    if (foe.reachedEnd) {
      state.foes.splice(i, 1);
      const devConfig = getDevConfig();
      const godMode = devConfig.godMode;
      const isGodMode = isDevEnabled() && godMode.enabled;
      const wave = state.waves.find((item) => item.id === foe.waveId);
      if (!isGodMode || !godMode.invulnerableBase) {
        const hpLoss =
          foe.type === "boss" || foe.isBoss ? GAME_CONFIG.gameplay.bossHpLoss : 1;
        state.hp = Math.max(0, state.hp - hpLoss);
        if (wave) {
          wave.hpLost = true;
        }
      }
      if (wave) {
        wave.remainingFoes = Math.max(0, wave.remainingFoes - 1);
      }
      onStateChange();
    } else if (foe.hp <= 0) {
      state.foes.splice(i, 1);
      state.gold += GAME_CONFIG.gameplay.killReward;
      const wave = state.waves.find((item) => item.id === foe.waveId);
      if (wave) {
        wave.remainingFoes = Math.max(0, wave.remainingFoes - 1);
      }
      onStateChange();
    }
  }
};

export { isBossWave, spawnBossFoe, spawnFoe, updateFoes };
