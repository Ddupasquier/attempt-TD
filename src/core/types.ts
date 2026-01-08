type TowerType = {
  id: string;
  name: string;
  cost: number;
  range: number;
  rate: number;
  damage: number;
  color: string;
  description: string;
};

type Tower = {
  id: string;
  col: number;
  row: number;
  type: TowerType;
  cooldown: number;
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
  targetIndex: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  reachedEnd?: boolean;
};

type WaveState = {
  id: string;
  waveNumber: number;
  spawnTimer: number;
  spawnIndex: number;
  totalSpawns: number;
  remainingEnemies: number;
};

type Projectile = {
  x: number;
  y: number;
  target: Enemy;
  speed: number;
  damage: number;
  color: string;
  towerTypeId: string;
  originX: number;
  originY: number;
  maxRange: number;
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
  wave: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  selectedTower: TowerType | null;
  waves: WaveState[];
  isCountingDown: boolean;
  countdownRemaining: number;
  elapsed: number;
  soundEnabled: boolean;
};

type SaveData = {
  gold: number;
  lives: number;
  wave: number;
  soundEnabled: boolean;
  selectedTowerId: string | null;
  towers: Array<{ col: number; row: number; typeId: string }>;
};

type PixelSprite = {
  pixels: string[];
  colors: Record<string, string>;
};

export type {
  Enemy,
  FactionConfig,
  FactionId,
  GameState,
  Grid,
  PixelSprite,
  Projectile,
  SaveData,
  Tower,
  TowerType,
  WaveState,
};
