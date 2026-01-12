import type { Grid, TowerType } from "./types";

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
  towerTypes: TowerType[];
  tower: {
    minRange: number;
  };
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
    types: {
      skirmisher: { hpMultiplier: number; speedMultiplier: number; sizeScale: number };
      raider: { hpMultiplier: number; speedMultiplier: number; sizeScale: number };
      bruiser: { hpMultiplier: number; speedMultiplier: number; sizeScale: number };
      bulwark: { hpMultiplier: number; speedMultiplier: number; sizeScale: number };
      elite: { hpMultiplier: number; speedMultiplier: number; sizeScale: number };
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
