import type { GameState } from "../types/core/types";
import { DEFENSE_IDS } from "../constants/defenseIds";
import { tileCenter } from "../core/geometry";
import { getDefenseStats } from "../core/defenseLevels";
import { GAME_CONFIG } from "../core/config";
import { getDevConfig, isDevEnabled } from "../core/devFlags";
import { applyAuraToStats, getDefenseAuraMultipliers } from "../core/defenseAuras";

const updateDefenses = (state: GameState, dt: number, size: number) => {
  for (const defense of state.defenses) {
    if (isDevEnabled()) {
      const devConfig = getDevConfig();
      if (devConfig.godMode.enabled && devConfig.godMode.noCooldowns) {
        defense.cooldown = 0;
      }
    }
    defense.cooldown -= dt;
    if (defense.cooldown > 0) continue;

    const center = tileCenter(defense.col, defense.row, size);
    const stats = getDefenseStats(defense);
    const aura = getDefenseAuraMultipliers(defense, state.defenses);
    const effectiveStats = applyAuraToStats(stats, aura);
    const range = effectiveStats.range * size;
    const slowConfig = defense.type.onHitSlow;
    const onHitSlow =
      slowConfig && stats.level >= slowConfig.minLevel ? slowConfig : null;

    if (defense.type.id === DEFENSE_IDS.siegeEngine) {
      if (state.waves.length === 0 || state.isCountingDown) continue;
      if (defense.targetCol === undefined || defense.targetRow === undefined) continue;
      const target = tileCenter(defense.targetCol, defense.targetRow, size);
      const distToTarget = Math.hypot(target.x - center.x, target.y - center.y);
      if (distToTarget > effectiveStats.range * size) continue;
      const isCrit = Math.random() < effectiveStats.critChance;
      const damage = effectiveStats.damage * (isCrit ? effectiveStats.critMultiplier : 1);

      state.projectiles.push({
        x: center.x,
        y: center.y,
        targetX: target.x,
        targetY: target.y,
        speed: GAME_CONFIG.gameplay.siegeProjectileSpeed * size,
        damage,
        damageType: defense.type.damageType,
        color: "#1a1a1a",
        defenseTypeId: defense.type.id,
        originX: center.x,
        originY: center.y,
        maxRange: effectiveStats.range * size,
        knockbackDistance: 0,
        splashRadius: size * GAME_CONFIG.gameplay.siegeSplashRadiusTiles,
        isCrit,
      });
      defense.cooldown = effectiveStats.rate;
      continue;
    }
    if (effectiveStats.damage <= 0) {
      defense.cooldown = 0;
      continue;
    }
    let target = null;
    let bestDist = Infinity;
    const skipKnockbackResist =
      defense.type.id === DEFENSE_IDS.paladin && effectiveStats.knockback > 0;
    for (const foe of state.foes) {
      if (foe.x === undefined || foe.y === undefined) continue;
      if (skipKnockbackResist && (foe.knockbackResistRemaining ?? 0) > 0) continue;
      const dx = foe.x - center.x;
      const dy = foe.y - center.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= range && dist < bestDist) {
        bestDist = dist;
        target = foe;
      }
    }
    if (!target) continue;

    defense.cooldown = effectiveStats.rate;
    const maxRange = effectiveStats.range * size;
    const knockbackDistance = effectiveStats.knockback * size;
    const isCrit = Math.random() < effectiveStats.critChance;
    const damage = effectiveStats.damage * (isCrit ? effectiveStats.critMultiplier : 1);
    state.projectiles.push({
      x: center.x,
      y: center.y,
      target,
      speed: GAME_CONFIG.gameplay.projectileSpeed * size,
      damage,
      damageType: defense.type.damageType,
      color: defense.type.color,
      defenseTypeId: defense.type.id,
      originX: center.x,
      originY: center.y,
      maxRange,
      knockbackDistance,
      isCrit,
      slowMultiplier: onHitSlow?.multiplier,
      slowDuration: onHitSlow?.duration,
    });
  }
};

export { updateDefenses };
