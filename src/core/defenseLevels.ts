import type { Defense } from "../types/core/types";
import { clamp } from "../utils/math";
import { GAME_CONFIG } from "./config";

const MAX_DEFENSE_LEVEL = GAME_CONFIG.maxDefenseLevel;

const DEFENSE_LEVEL_STATS = GAME_CONFIG.defenseLevelStats;
const DEFENSE_LEVEL_COSTS = GAME_CONFIG.defenseLevelCosts;

const clampDefenseLevel = (level: number) => clamp(level, 0, MAX_DEFENSE_LEVEL);

const getDefenseStatsAtLevel = (defense: Defense, level: number) => {
  const clampedLevel = clampDefenseLevel(level);
  const stats = DEFENSE_LEVEL_STATS[clampedLevel] ?? DEFENSE_LEVEL_STATS[0];
  const baseRange = defense.type.range + defense.rangeBonus;
  const baseDamage = defense.type.damage * (1 + (defense.damageBonus ?? 0));
  return {
    level: clampedLevel,
    range: baseRange * stats.rangeMult,
    rate: defense.type.rate * stats.rateMult,
    damage: baseDamage * stats.damageMult,
    critChance: defense.type.critChance,
    critMultiplier: defense.type.critMultiplier,
    knockback: defense.type.knockback * stats.knockbackMult,
  };
};

const getDefenseStats = (defense: Defense) => getDefenseStatsAtLevel(defense, defense.level);

const getDefenseUpgradeCost = (defense: Defense, nextLevel: number) => {
  const clampedLevel = clampDefenseLevel(nextLevel);
  if (clampedLevel <= 0) return 0;
  const costScale = DEFENSE_LEVEL_COSTS.find((entry) => entry.level === clampedLevel);
  if (!costScale) return Infinity;
  return Math.ceil(defense.type.cost * costScale.costMultiplier);
};

export {
  MAX_DEFENSE_LEVEL,
  clampDefenseLevel,
  getDefenseStats,
  getDefenseStatsAtLevel,
  getDefenseUpgradeCost,
};
