import type { GameState } from "../types/core/types";
import { GAME_CONFIG } from "../core/config";
import { TOWER_IDS } from "../constants/towerIds";
import { getCatapultDamagePopupStyle } from "../core/isDev";

const updateProjectiles = (
  state: GameState,
  dt: number,
  playDamageSound: (towerTypeId: string) => void,
  showDamagePopups: boolean,
) => {
  const pushDamagePopup = (
    x: number,
    y: number,
    value: number,
    color?: string,
    duration = 0.6,
    sizeMult = 1,
  ) => {
    if (!showDamagePopups || value <= 0) return;
    state.damagePopups.push({
      x,
      y,
      value,
      color,
      time: 0,
      duration,
      sizeMult,
    });
  };

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
        if (bolt.target.x !== undefined && bolt.target.y !== undefined) {
          const style =
            bolt.towerTypeId === TOWER_IDS.catapult ? getCatapultDamagePopupStyle() : {};
          pushDamagePopup(
            bolt.target.x,
            bolt.target.y,
            Math.round(bolt.damage),
            style.color,
            style.duration ?? 0.6,
            style.sizeMult ?? 1,
          );
        }
      } else if (bolt.splashRadius) {
        for (const enemy of state.enemies) {
          if (enemy.x === undefined || enemy.y === undefined) continue;
          const sx = enemy.x - targetX;
          const sy = enemy.y - targetY;
          const sdist = Math.hypot(sx, sy);
          if (sdist > bolt.splashRadius) continue;
          const falloff = Math.max(0, 1 - sdist / bolt.splashRadius);
          const damage = bolt.damage * falloff;
          enemy.hp -= damage;
          const style =
            bolt.towerTypeId === TOWER_IDS.catapult ? getCatapultDamagePopupStyle() : {};
          pushDamagePopup(
            enemy.x,
            enemy.y,
            Math.round(damage),
            style.color,
            style.duration ?? 0.6,
            style.sizeMult ?? 1,
          );
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
        if ((bolt.target.knockbackResistRemaining ?? 0) > 0) {
          playDamageSound(bolt.towerTypeId);
          state.projectiles.splice(i, 1);
          continue;
        }
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
          const typeScale =
            bolt.target.isBoss || bolt.target.type === "boss"
              ? GAME_CONFIG.enemy.bossKnockbackDistanceMultiplier
              : GAME_CONFIG.enemy.types[bolt.target.type].knockbackDistanceMultiplier;
          const resistance =
            bolt.target.isBoss || bolt.target.type === "elite" ? 0.5 : 1;
          const knockbackDistance = bolt.knockbackDistance * 2.6 * resistance * typeScale;
          bolt.target.knockbackRemaining = Math.max(
            bolt.target.knockbackRemaining ?? 0,
            knockbackDistance,
          );
          bolt.target.knockbackX = 0;
          bolt.target.knockbackY = 0;
          bolt.target.knockbackResistRemaining =
            bolt.target.isBoss || bolt.target.type === "boss"
              ? GAME_CONFIG.enemy.bossKnockbackResistSeconds
              : GAME_CONFIG.enemy.types[bolt.target.type].knockbackResistSeconds;
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
