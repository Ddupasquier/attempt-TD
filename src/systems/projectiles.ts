import type { GameState } from "../types/core/types";

const updateProjectiles = (
  state: GameState,
  dt: number,
  playDamageSound: (towerTypeId: string) => void,
) => {
  for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
    const bolt = state.projectiles[i];
    if (!bolt.target && bolt.targetX === undefined) {
      state.projectiles.splice(i, 1);
      continue;
    }
    if (bolt.target && bolt.target.hp <= 0) {
      state.projectiles.splice(i, 1);
      continue;
    }
    if (bolt.target && (bolt.target.x === undefined || bolt.target.y === undefined)) {
      state.projectiles.splice(i, 1);
      continue;
    }
    const targetX = bolt.target ? bolt.target.x ?? bolt.x : bolt.targetX ?? bolt.x;
    const targetY = bolt.target ? bolt.target.y ?? bolt.y : bolt.targetY ?? bolt.y;
    const rangeDx = targetX - bolt.originX;
    const rangeDy = targetY - bolt.originY;
    if (Math.hypot(rangeDx, rangeDy) > bolt.maxRange) {
      state.projectiles.splice(i, 1);
      continue;
    }
    const dx = targetX - bolt.x;
    const dy = targetY - bolt.y;
    const dist = Math.hypot(dx, dy);
    const step = bolt.speed * dt;
    if (dist <= step) {
      if (bolt.target) {
        bolt.target.hp -= bolt.damage;
      } else if (bolt.splashRadius) {
        for (const enemy of state.enemies) {
          if (enemy.x === undefined || enemy.y === undefined) continue;
          const sx = enemy.x - targetX;
          const sy = enemy.y - targetY;
          const sdist = Math.hypot(sx, sy);
          if (sdist > bolt.splashRadius) continue;
          const falloff = Math.max(0, 1 - sdist / bolt.splashRadius);
          enemy.hp -= bolt.damage * falloff;
        }
        state.effects.push({
          x: targetX,
          y: targetY,
          radius: bolt.splashRadius,
          time: 0,
          duration: 0.35,
        });
      }
      if (bolt.target && bolt.knockbackDistance > 0) {
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
          const resistance =
            bolt.target.isBoss || bolt.target.type === "elite" ? 0.5 : 1;
          const pushSpeed = bolt.knockbackDistance * 6 * resistance;
          bolt.target.knockbackX = (bolt.target.knockbackX ?? 0) - directionX * pushSpeed;
          bolt.target.knockbackY = (bolt.target.knockbackY ?? 0) - directionY * pushSpeed;
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
