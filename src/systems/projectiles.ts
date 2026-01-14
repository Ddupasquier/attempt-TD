import type { GameState } from "../types/core/types";
import { GAME_CONFIG } from "../core/config";
import { getDevConfig, isDevEnabled } from "../core/devFlags";
import { DEFENSE_IDS } from "../constants/defenseIds";
import { getSiegeDamagePopupStyle } from "../core/devFlags";
import { applyDamageModifiers } from "../core/combat";

const applySlow = (
  foe: GameState["foes"][number],
  multiplier: number,
  duration: number,
) => {
  foe.slowRemaining = Math.max(foe.slowRemaining ?? 0, duration);
  foe.slowMultiplier = Math.min(foe.slowMultiplier ?? 1, multiplier);
};

const updateProjectiles = (
  state: GameState,
  dt: number,
  playDamageSound: (defenseTypeId: string) => void,
  showDamagePopups: boolean,
) => {
  const devConfig = getDevConfig();
  const godMode = devConfig.godMode;
  const isGodMode = isDevEnabled() && godMode.enabled;
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
        if (isGodMode && godMode.oneShotFoes) {
          const damage = bolt.target.hp;
          bolt.target.hp = 0;
          if (bolt.target.x !== undefined && bolt.target.y !== undefined) {
            const style = bolt.isCrit
              ? {
                  color: "#d60000",
                  duration: 1.1,
                  sizeMult: 1.4,
                }
              : bolt.defenseTypeId === DEFENSE_IDS.siegeEngine
                ? getSiegeDamagePopupStyle()
                : undefined;
            pushDamagePopup(
              bolt.target.x,
              bolt.target.y,
              Math.round(damage),
              style?.color,
              style?.duration ?? 0.6,
              style?.sizeMult ?? 1,
            );
          }
          if (bolt.slowMultiplier && bolt.slowDuration) {
            applySlow(bolt.target, bolt.slowMultiplier, bolt.slowDuration);
          }
        } else {
          const damage = applyDamageModifiers(
            bolt.damage,
            bolt.damageType,
            bolt.target.damageResistances,
            bolt.target.damageGroupResistances,
          );
          bolt.target.hp -= damage;
          if (bolt.target.x !== undefined && bolt.target.y !== undefined) {
            const style = bolt.isCrit
              ? {
                  color: "#d60000",
                  duration: 1.1,
                  sizeMult: 1.4,
                }
              : bolt.defenseTypeId === DEFENSE_IDS.siegeEngine
                ? getSiegeDamagePopupStyle()
                : undefined;
            pushDamagePopup(
              bolt.target.x,
              bolt.target.y,
              Math.round(damage),
              style?.color,
              style?.duration ?? 0.6,
              style?.sizeMult ?? 1,
            );
          }
          if (bolt.slowMultiplier && bolt.slowDuration) {
            applySlow(bolt.target, bolt.slowMultiplier, bolt.slowDuration);
          }
        }
      } else if (bolt.splashRadius) {
        for (const foe of state.foes) {
          if (foe.x === undefined || foe.y === undefined) continue;
          const sx = foe.x - targetX;
          const sy = foe.y - targetY;
          const sdist = Math.hypot(sx, sy);
          if (sdist > bolt.splashRadius) continue;
          const falloff = Math.max(0, 1 - sdist / bolt.splashRadius);
          const damage = applyDamageModifiers(
            bolt.damage * falloff,
            bolt.damageType,
            foe.damageResistances,
            foe.damageGroupResistances,
          );
          if (isGodMode && godMode.oneShotFoes) {
            foe.hp = 0;
          } else {
            foe.hp -= damage;
          }
          const style = bolt.isCrit
            ? {
                color: "#d60000",
                duration: 1.1,
                sizeMult: 1.4,
              }
            : bolt.defenseTypeId === DEFENSE_IDS.siegeEngine
              ? getSiegeDamagePopupStyle()
              : undefined;
          pushDamagePopup(
            foe.x,
            foe.y,
            Math.round(damage),
            style?.color,
            style?.duration ?? 0.6,
            style?.sizeMult ?? 1,
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
          playDamageSound(bolt.defenseTypeId);
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
              ? GAME_CONFIG.foe.bossKnockbackDistanceMultiplier
              : GAME_CONFIG.foe.types[bolt.target.type].knockbackDistanceMultiplier;
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
              ? GAME_CONFIG.foe.bossKnockbackResistSeconds
              : GAME_CONFIG.foe.types[bolt.target.type].knockbackResistSeconds;
        }
      }
      playDamageSound(bolt.defenseTypeId);
      state.projectiles.splice(i, 1);
      continue;
    }
    bolt.x += (dx / dist) * step;
    bolt.y += (dy / dist) * step;
  }
};

export { updateProjectiles };
