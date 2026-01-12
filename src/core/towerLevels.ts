import type { Tower } from "../types/core/types";
import { clamp } from "../utils/math";
import { GAME_CONFIG } from "./config";

const MAX_TOWER_LEVEL = GAME_CONFIG.maxTowerLevel;

const TOWER_LEVEL_STATS = GAME_CONFIG.towerLevelStats;
const TOWER_LEVEL_COSTS = GAME_CONFIG.towerLevelCosts;

const clampTowerLevel = (level: number) => clamp(level, 0, MAX_TOWER_LEVEL);

const getTowerStatsAtLevel = (tower: Tower, level: number) => {
  const clampedLevel = clampTowerLevel(level);
  const stats = TOWER_LEVEL_STATS[clampedLevel] ?? TOWER_LEVEL_STATS[0];
  const baseRange = tower.type.range + tower.rangeBonus;
  return {
    level: clampedLevel,
    range: baseRange * stats.rangeMult,
    rate: tower.type.rate * stats.rateMult,
    damage: tower.type.damage * stats.damageMult,
    knockback: tower.type.knockback * stats.knockbackMult,
  };
};

const getTowerStats = (tower: Tower) => getTowerStatsAtLevel(tower, tower.level);

const getTowerUpgradeCost = (tower: Tower, nextLevel: number) => {
  const clampedLevel = clampTowerLevel(nextLevel);
  if (clampedLevel <= 0) return 0;
  const costScale = TOWER_LEVEL_COSTS.find((entry) => entry.level === clampedLevel);
  if (!costScale) return Infinity;
  return Math.ceil(tower.type.cost * costScale.costMultiplier);
};

export { MAX_TOWER_LEVEL, clampTowerLevel, getTowerStats, getTowerStatsAtLevel, getTowerUpgradeCost };
