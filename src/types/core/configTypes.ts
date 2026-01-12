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
  };
};

export type { GameConfig, TowerLevelCostScale, TowerLevelStats };
