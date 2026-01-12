import type { GameState } from "../types/core/types";
import { tileCenter } from "../core/geometry";
import { getTowerStats } from "../core/towerLevels";

const updateTowers = (state: GameState, dt: number, size: number) => {
  for (const tower of state.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;

    const center = tileCenter(tower.col, tower.row, size);
    const stats = getTowerStats(tower);
    const range = stats.range * size;
    let target = null;
    let bestDist = Infinity;
    for (const enemy of state.enemies) {
      if (enemy.x === undefined || enemy.y === undefined) continue;
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
