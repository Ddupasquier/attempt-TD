import type { GameState, WaveState } from "../core/types";
import { getFactionForWave, pathPoints } from "../core/data";

const spawnEnemy = (state: GameState, wave: WaveState) => {
  const hp = 32 + wave.waveNumber * 6;
  const speed = 0.6 + wave.waveNumber * 0.03;
  const faction = getFactionForWave(wave.waveNumber);
  state.enemies.push({
    id: crypto.randomUUID(),
    hp,
    maxHp: hp,
    speed,
    waveId: wave.id,
    faction: faction.id,
    targetIndex: 1,
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

export { spawnEnemy, updateEnemies };
