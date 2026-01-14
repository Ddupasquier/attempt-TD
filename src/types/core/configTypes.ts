import type {
  DamageGroupResistances,
  DamageResistances,
  Grid,
  DefenseType,
  SpellScrollType,
} from "./types";

type DefenseLevelStats = {
  damageMult: number;
  rangeMult: number;
  rateMult: number;
  knockbackMult: number;
};

type DefenseLevelCostScale = {
  level: number;
  costMultiplier: number;
};

type GameConfig = {
  grid: Grid;
  gameplay: {
    startingGold: number;
    startingHp: number;
    maxHp: number;
    startingWave: number;
    speedSteps: number[];
    countdownSeconds: number;
    killReward: number;
    bossHpLoss: number;
    flawlessHpGain: number;
    bossFlawlessHpGain: number;
    foeTurnStrength: number;
    foeArrivalThreshold: number;
    knockbackSpeed: number;
    backtrackThreshold: number;
    projectileSpeed: number;
    siegeProjectileSpeed: number;
    siegeSplashRadiusTiles: number;
    rangerTreeDamageBonus: number;
  };
  defenseTypes: DefenseType[];
  defense: {
    minRange: number;
  };
  spellScrollTypes: SpellScrollType[];
  maxDefenseLevel: number;
  defenseLevelStats: DefenseLevelStats[];
  defenseLevelCosts: DefenseLevelCostScale[];
  wave: {
    initialSpawnDelay: number;
    spawnInterval: number;
    baseSpawns: number;
    spawnsPerWave: number;
    waveReward: number;
  };
  foe: {
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
        damageResistances?: DamageResistances;
        damageGroupResistances?: DamageGroupResistances;
      };
      raider: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
        damageResistances?: DamageResistances;
        damageGroupResistances?: DamageGroupResistances;
      };
      bruiser: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
        damageResistances?: DamageResistances;
        damageGroupResistances?: DamageGroupResistances;
      };
      bulwark: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
        damageResistances?: DamageResistances;
        damageGroupResistances?: DamageGroupResistances;
      };
      elite: {
        hpMultiplier: number;
        speedMultiplier: number;
        sizeScale: number;
        knockbackResistSeconds: number;
        knockbackDistanceMultiplier: number;
        damageResistances?: DamageResistances;
        damageGroupResistances?: DamageGroupResistances;
      };
    };
    bossDamageResistances?: DamageResistances;
    bossDamageGroupResistances?: DamageGroupResistances;
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

export type { GameConfig, DefenseLevelCostScale, DefenseLevelStats };
