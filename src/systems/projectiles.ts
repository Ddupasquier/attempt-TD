import type { GameState } from "../core/types";

const updateProjectiles = (
  state: GameState,
  dt: number,
  playDamageSound: (towerTypeId: string) => void,
) => {
  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const bolt = state.projectiles[i];
    if (!bolt.target || bolt.target.hp <= 0) {
      state.projectiles.splice(i, 1);
      continue;
    }
    if (bolt.target.x === undefined || bolt.target.y === undefined) {
      state.projectiles.splice(i, 1);
      continue;
    }
    const rangeDx = bolt.target.x - bolt.originX;
    const rangeDy = bolt.target.y - bolt.originY;
    if (Math.hypot(rangeDx, rangeDy) > bolt.maxRange) {
      state.projectiles.splice(i, 1);
      continue;
    }
    const dx = bolt.target.x - bolt.x;
    const dy = bolt.target.y - bolt.y;
    const dist = Math.hypot(dx, dy);
    const step = bolt.speed * dt;
    if (dist <= step) {
      bolt.target.hp -= bolt.damage;
      playDamageSound(bolt.towerTypeId);
      state.projectiles.splice(i, 1);
      continue;
    }
    bolt.x += (dx / dist) * step;
    bolt.y += (dy / dist) * step;
  }
};

export { updateProjectiles };
