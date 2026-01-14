type DamageType =
  | "bludgeoning"
  | "piercing"
  | "slashing"
  | "acid"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "poison"
  | "psychic"
  | "radiant"
  | "thunder";

type DamageGroup = "physical" | "magical";

type DamageResistances = Partial<Record<DamageType, number>>;

type DamageGroupResistances = Partial<Record<DamageGroup, number>>;

type TowerType = {
  id: string;
  name: string;
  types: string[];
  cost: number;
  range: number;
  rate: number;
  damage: number;
  damageType: DamageType;
  critChance: number;
  critMultiplier: number;
  knockback: number;
  damageResistances?: DamageResistances;
  damageGroupResistances?: DamageGroupResistances;
  color: string;
  description: string;
};

type TrapType = {
  id: string;
  name: string;
  types: string[];
  cost: number;
  maxTriggers?: number;
  cooldownSeconds?: number;
  cooldownPerWave?: boolean;
  damage?: number;
  damageType?: DamageType;
  splashRadiusTiles?: number;
  slowMultiplier?: number;
  slowDuration?: number;
  killsAll?: boolean;
  description: string;
};

type Tower = {
  id: string;
  col: number;
  row: number;
  type: TowerType;
  cooldown: number;
  rangeBonus: number;
  damageBonus: number;
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
  knockbackRemaining?: number;
  knockbackResistRemaining?: number;
  slowRemaining?: number;
  slowMultiplier?: number;
  lastTrapTile?: string;
  reachedEnd?: boolean;
  damageResistances?: DamageResistances;
  damageGroupResistances?: DamageGroupResistances;
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
  damageType: DamageType;
  color: string;
  towerTypeId: string;
  originX: number;
  originY: number;
  maxRange: number;
  knockbackDistance: number;
  splashRadius?: number;
  isCrit?: boolean;
};

type Trap = {
  id: string;
  col: number;
  row: number;
  type: TrapType;
  triggersRemaining?: number;
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
  traps: Trap[];
  trapCooldowns: Record<string, number>;
  enemies: Enemy[];
  projectiles: Projectile[];
  effects: SplashEffect[];
  damagePopups: DamagePopup[];
  selectedTower: TowerType | null;
  waves: WaveState[];
  isCountingDown: boolean;
  countdownRemaining: number;
  elapsed: number;
  soundEnabled: boolean;
  autoWaveEnabled: boolean;
  showDamagePopups: boolean;
};

type SplashEffect = {
  x: number;
  y: number;
  radius: number;
  time: number;
  duration: number;
};

type DamagePopup = {
  x: number;
  y: number;
  value: number;
  color?: string;
  sizeMult?: number;
  time: number;
  duration: number;
};

type SaveData = {
  gold: number;
  lives: number;
  wave: number;
  soundEnabled: boolean;
  autoWaveEnabled?: boolean;
  showDamagePopups?: boolean;
  selectedTowerId: string | null;
  trapCooldowns?: Record<string, number>;
  isCountingDown?: boolean;
  countdownRemaining?: number;
  waves?: Array<{
    id: string;
    waveNumber: number;
    spawnTimer: number;
    spawnIndex: number;
    totalSpawns: number;
    remainingEnemies: number;
    bossSpawned?: boolean;
    livesLost?: boolean;
  }>;
  enemies?: Array<{
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
    knockbackRemaining?: number;
    knockbackResistRemaining?: number;
    slowRemaining?: number;
    slowMultiplier?: number;
    lastTrapTile?: string;
  }>;
  traps?: Array<{
    col: number;
    row: number;
    typeId: string;
    triggersRemaining?: number;
  }>;
  towers: Array<{
    col: number;
    row: number;
    typeId: string;
    level?: number;
    cooldown?: number;
    targetCol?: number;
    targetRow?: number;
  }>;
};

type PixelSprite = {
  pixels: string[];
  colors: Record<string, string>;
};

export type {
  DamageGroup,
  DamageGroupResistances,
  DamageResistances,
  DamageType,
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
  DamagePopup,
  Trap,
  TrapType,
  Tower,
  TowerType,
  WaveState,
};
