import type { GameState } from "../core/types";
import { tileCenter } from "../core/geometry";

export function updateTowers(state: GameState, dt: number, size: number) {
  for (const tower of state.towers) {
    tower.cooldown -= dt;
    if (tower.cooldown > 0) continue;

    const center = tileCenter(tower.col, tower.row, size);
    const range = tower.type.range * size;
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

    tower.cooldown = tower.type.rate;
    const maxRange = tower.type.range * size;
    state.projectiles.push({
      x: center.x,
      y: center.y,
      target,
      speed: 4.5 * size,
      damage: tower.type.damage,
      color: tower.type.color,
      towerTypeId: tower.type.id,
      originX: center.x,
      originY: center.y,
      maxRange,
    });
  }
}
