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
      if (bolt.knockbackDistance > 0) {
        let directionX = 0;
        let directionY = 0;
        if (bolt.target.vx !== undefined && bolt.target.vy !== undefined) {
          const velocityMagnitude = Math.hypot(bolt.target.vx, bolt.target.vy);
          if (velocityMagnitude > 0) {
            directionX = bolt.target.vx / velocityMagnitude;
            directionY = bolt.target.vy / velocityMagnitude;
          }
        }
        if (directionX === 0 && directionY === 0) {
          const originDx = bolt.target.x - bolt.originX;
          const originDy = bolt.target.y - bolt.originY;
          const originMagnitude = Math.hypot(originDx, originDy);
          if (originMagnitude > 0) {
            directionX = originDx / originMagnitude;
            directionY = originDy / originMagnitude;
          }
        }
        if (directionX !== 0 || directionY !== 0) {
          bolt.target.x -= directionX * bolt.knockbackDistance;
          bolt.target.y -= directionY * bolt.knockbackDistance;
        }
      }
      playDamageSound(bolt.towerTypeId);
      state.projectiles.splice(i, 1);
      continue;
    }
    bolt.x += (dx / dist) * step;
    bolt.y += (dy / dist) * step;
  }
};

export { updateProjectiles };
