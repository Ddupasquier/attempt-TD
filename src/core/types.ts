export type TowerType = {
  id: string;
  name: string;
  cost: number;
  range: number;
  rate: number;
  damage: number;
  color: string;
  description: string;
};

export type Tower = {
  id: string;
  col: number;
  row: number;
  type: TowerType;
  cooldown: number;
};

export type FactionId =
  | "humans"
  | "orcs"
  | "elves"
  | "undead"
  | "dwarves"
  | "spirits"
  | "demons"
  | "dragons";

export type Enemy = {
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

export type WaveState = {
  id: string;
  waveNumber: number;
  spawnTimer: number;
  spawnIndex: number;
  totalSpawns: number;
  remainingEnemies: number;
};

export type Projectile = {
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

export type FactionConfig = {
  id: FactionId;
  name: string;
  start: number;
  end: number;
};

export type Grid = {
  cols: number;
  rows: number;
};

export type GameState = {
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

export type SaveData = {
  gold: number;
  lives: number;
  wave: number;
  soundEnabled: boolean;
  selectedTowerId: string | null;
  towers: Array<{ col: number; row: number; typeId: string }>;
};

export type PixelSprite = {
  pixels: string[];
  colors: Record<string, string>;
};
