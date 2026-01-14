import type { GameState } from "../types/core/types";
import { TOWER_IDS } from "../constants/towerIds";
import { tileCenter } from "../core/geometry";
import { getTowerStats } from "../core/towerLevels";
import { GAME_CONFIG } from "../core/config";
import { getDevConfig, isDevEnabled } from "../core/devFlags";

const updateTowers = (state: GameState, dt: number, size: number) => {
  for (const tower of state.towers) {
    if (isDevEnabled()) {
      const devConfig = getDevConfig();
      if (devConfig.godMode.enabled && devConfig.godMode.noCooldowns) {
        tower.cooldown = 0;
      }
    }
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
      const isCrit = Math.random() < stats.critChance;
      const damage = stats.damage * (isCrit ? stats.critMultiplier : 1);

      state.projectiles.push({
        x: center.x,
        y: center.y,
        targetX: target.x,
        targetY: target.y,
        speed: GAME_CONFIG.gameplay.catapultProjectileSpeed * size,
        damage,
        damageType: tower.type.damageType,
        color: "#1a1a1a",
        towerTypeId: tower.type.id,
        originX: center.x,
        originY: center.y,
        maxRange: stats.range * size,
        knockbackDistance: 0,
        splashRadius: size * GAME_CONFIG.gameplay.catapultSplashRadiusTiles,
        isCrit,
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
    const isCrit = Math.random() < stats.critChance;
    const damage = stats.damage * (isCrit ? stats.critMultiplier : 1);
    state.projectiles.push({
      x: center.x,
      y: center.y,
      target,
      speed: GAME_CONFIG.gameplay.projectileSpeed * size,
      damage,
      damageType: tower.type.damageType,
      color: tower.type.color,
      towerTypeId: tower.type.id,
      originX: center.x,
      originY: center.y,
      maxRange,
      knockbackDistance,
      isCrit,
    });
  }
};

export { updateTowers };
