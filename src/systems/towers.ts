import type { GameState } from "../types/core/types";
import { TOWER_IDS } from "../constants/towerIds";
import { tileCenter } from "../core/geometry";
import { getTowerStats } from "../core/towerLevels";

const updateTowers = (state: GameState, dt: number, size: number) => {
  for (const tower of state.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;

    const center = tileCenter(tower.col, tower.row, size);
    const stats = getTowerStats(tower);
    const range = stats.range * size;

    if (tower.type.id === TOWER_IDS.catapult) {
      if (state.waves.length === 0 || state.isCountingDown) continue;
      if (tower.targetCol === undefined || tower.targetRow === undefined) continue;
      const target = tileCenter(tower.targetCol, tower.targetRow, size);
      const distToTarget = Math.hypot(target.x - center.x, target.y - center.y);
      if (distToTarget > range) continue;

      state.projectiles.push({
        x: center.x,
        y: center.y,
        targetX: target.x,
        targetY: target.y,
        speed: 3 * size,
        damage: stats.damage,
        color: "#1a1a1a",
        towerTypeId: tower.type.id,
        originX: center.x,
        originY: center.y,
        maxRange: stats.range * size,
        knockbackDistance: 0,
        splashRadius: size * 1,
      });
      tower.cooldown = stats.rate;
      continue;
    }
    let target = null;
    let bestDist = Infinity;
    const skipKnockbackResist =
      tower.type.id === TOWER_IDS.warden && stats.knockback > 0;
    for (const enemy of state.enemies) {
      if (enemy.x === undefined || enemy.y === undefined) continue;
      if (skipKnockbackResist && (enemy.knockbackResistRemaining ?? 0) > 0) continue;
      const dx = enemy.x - center.x;
      const dy = enemy.y - center.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= range && dist < bestDist) {
        bestDist = dist;
        target = enemy;
      }
    }
    if (!target) continue;

    tower.cooldown = stats.rate;
    const maxRange = stats.range * size;
    const knockbackDistance = stats.knockback * size;
    state.projectiles.push({
      x: center.x,
      y: center.y,
      target,
      speed: 4.5 * size,
      damage: stats.damage,
      color: tower.type.color,
      towerTypeId: tower.type.id,
      originX: center.x,
      originY: center.y,
      maxRange,
      knockbackDistance,
    });
  }
};

export { updateTowers };
