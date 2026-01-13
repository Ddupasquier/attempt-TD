import type { Grid, TowerType, TrapType } from "./types";

type TowerLevelStats = {
  damageMult: number;
  rangeMult: number;
  rateMult: number;
  knockbackMult: number;
};

type TowerLevelCostScale = {
  level: number;
  costMultiplier: number;
};

type GameConfig = {
  grid: Grid;
  gameplay: {
    startingGold: number;
    startingLives: number;
    maxLives: number;
    startingWave: number;
    speedSteps: number[];
    countdownSeconds: number;
    killReward: number;
    bossLifeLoss: number;
    flawlessLifeGain: number;
    bossFlawlessLifeGain: number;
    enemyTurnStrength: number;
    enemyArrivalThreshold: number;
    knockbackSpeed: number;
    backtrackThreshold: number;
    projectileSpeed: number;
    catapultProjectileSpeed: number;
    catapultSplashRadiusTiles: number;
    archerTreeDamageBonus: number;
  };
  towerTypes: TowerType[];
  tower: {
    minRange: number;
  };
  trapTypes: TrapType[];
  maxTowerLevel: number;
  towerLevelStats: TowerLevelStats[];
  towerLevelCosts: TowerLevelCostScale[];
  wave: {
    initialSpawnDelay: number;
    spawnInterval: number;
    baseSpawns: number;
    spawnsPerWave: number;
    waveReward: number;
  };
  enemy: {
    baseHp: number;
    hpPerWave: number;
    baseSpeed: number;
    speedPerWave: number;
    bossInterval: number;
    bossHpMultiplier: number;
    bossSpeedMultiplier: number;
    bossScale: number;
    bossKnockbackResistSeconds: number;
    bossKnockbackDistanceMultiplier: number;
    types: {
      skirmisher: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
      };
      raider: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
      };
      bruiser: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
      };
      bulwark: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
      };
      elite: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
      };
    };
    typeSpawnWeights: Array<{
      maxWave: number;
      weights: Partial<Record<"skirmisher" | "raider" | "bruiser" | "bulwark" | "elite", number>>;
    }>;
    typeSpawnWeightsByFaction: Partial<
      Record<
        "humans" | "orcs" | "elves" | "undead" | "dwarves" | "spirits" | "demons" | "dragons",
        Array<{
          maxWave: number;
          weights: Partial<Record<"skirmisher" | "raider" | "bruiser" | "bulwark" | "elite", number>>;
        }>
      >
    >;
  };
};

export type { GameConfig, TowerLevelCostScale, TowerLevelStats };
