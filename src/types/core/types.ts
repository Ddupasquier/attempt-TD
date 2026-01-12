type TowerType = {
  id: string;
  name: string;
  types: string[];
  cost: number;
  range: number;
  rate: number;
  damage: number;
  knockback: number;
  color: string;
  description: string;
};

type Tower = {
  id: string;
  col: number;
  row: number;
  type: TowerType;
  cooldown: number;
  rangeBonus: number;
  level: number;
  targetCol?: number;
  targetRow?: number;
};

type FactionId =
  | "humans"
  | "orcs"
  | "elves"
  | "undead"
  | "dwarves"
  | "spirits"
  | "demons"
  | "dragons";

type Enemy = {
  id: string;
  hp: number;
  maxHp: number;
  speed: number;
  waveId: string;
  faction: FactionId;
  type: EnemyType;
  targetIndex: number;
  isBoss?: boolean;
  sizeScale?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  knockbackX?: number;
  knockbackY?: number;
  knockbackResistRemaining?: number;
  reachedEnd?: boolean;
};

type WaveState = {
  id: string;
  waveNumber: number;
  spawnTimer: number;
  spawnIndex: number;
  totalSpawns: number;
  remainingEnemies: number;
  bossSpawned?: boolean;
  livesLost?: boolean;
};

type EnemyType = "skirmisher" | "raider" | "bruiser" | "bulwark" | "elite" | "boss";

type Projectile = {
  x: number;
  y: number;
  target?: Enemy;
  targetX?: number;
  targetY?: number;
  speed: number;
  damage: number;
  color: string;
  towerTypeId: string;
  originX: number;
  originY: number;
  maxRange: number;
  knockbackDistance: number;
  splashRadius?: number;
};

type FactionConfig = {
  id: FactionId;
  name: string;
  start: number;
  end: number;
};

type Grid = {
  cols: number;
  rows: number;
};

type GameState = {
  gold: number;
  lives: number;
  maxLives: number;
  wave: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  effects: SplashEffect[];
  selectedTower: TowerType | null;
  waves: WaveState[];
  isCountingDown: boolean;
  countdownRemaining: number;
  elapsed: number;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
};

type SplashEffect = {
  x: number;
  y: number;
  radius: number;
  time: number;
  duration: number;
};

type SaveData = {
  gold: number;
  lives: number;
  wave: number;
  soundEnabled: boolean;
  autoWaveEnabled?: boolean;
  selectedTowerId: string | null;
  towers: Array<{ col: number; row: number; typeId: string; level?: number; targetCol?: number; targetRow?: number }>;
};

type PixelSprite = {
  pixels: string[];
  colors: Record<string, string>;
};

export type {
  Enemy,
  EnemyType,
  FactionConfig,
  FactionId,
  GameState,
  Grid,
  PixelSprite,
  Projectile,
  SaveData,
  SplashEffect,
  Tower,
  TowerType,
  WaveState,
};
