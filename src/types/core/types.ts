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

type DefenseAuraBonuses = {
  damageMult: number;
  rangeMult: number;
  rateMult: number;
};

type DefenseType = {
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
  levelStatsOverrides?: Array<{
    damageMult: number;
    rangeMult: number;
    rateMult: number;
    knockbackMult: number;
  }>;
  levelDamageBonuses?: number[];
  onHitSlow?: {
    minLevel: number;
    multiplier: number;
    duration: number;
  };
  splashRadiusTiles?: number;
  auraRangeTiles?: number;
  auraBonuses?: DefenseAuraBonuses;
  damageResistances?: DamageResistances;
  damageGroupResistances?: DamageGroupResistances;
  color: string;
  description: string;
};

type SpellScrollSound = "shock" | "boom" | "nuke" | "glue";

type SpellScrollType = {
  id: string;
  name: string;
  types: string[];
  cost: number;
  maxTriggers?: number;
  cooldownSeconds?: number;
  cooldownPerWave?: boolean;
  damage?: number;
  damageType?: DamageType;
  knockbackDistanceTiles?: number;
  splashRadiusTiles?: number;
  slowMultiplier?: number;
  slowDuration?: number;
  killsAll?: boolean;
  soundEffect?: SpellScrollSound;
  description: string;
};

type Defense = {
  id: string;
  col: number;
  row: number;
  type: DefenseType;
  cooldown: number;
  rangeBonus: number;
  damageBonus: number;
  level: number;
  targetCol?: number;
  targetRow?: number;
};

type FactionId =
  | "necrotic-legion"
  | "vampiric-court"
  | "infernal-contract"
  | "abyssal-horde"
  | "draconic-brood"
  | "elemental-conclave"
  | "goblin-warrens"
  | "orcish-warclans"
  | "giantkin-tribes"
  | "arcane-cabal"
  | "illithid-dominion"
  | "feywild-host"
  | "verdant-circle"
  | "yuan-ti-coil"
  | "eldritch-beyond"
  | "construct-imperium";

type Foe = {
  id: string;
  hp: number;
  maxHp: number;
  speed: number;
  waveId: string;
  faction: FactionId;
  type: FoeType;
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
  lastSpellScrollTile?: string;
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
  remainingFoes: number;
  bossSpawned?: boolean;
  hpLost?: boolean;
};

type FoeType = "swarm" | "grunt" | "tank" | "elite" | "boss";

type Projectile = {
  x: number;
  y: number;
  target?: Foe;
  targetX?: number;
  targetY?: number;
  speed: number;
  damage: number;
  damageType: DamageType;
  color: string;
  defenseTypeId: string;
  originX: number;
  originY: number;
  maxRange: number;
  knockbackDistance: number;
  splashRadius?: number;
  isCrit?: boolean;
  slowMultiplier?: number;
  slowDuration?: number;
};

type SpellScroll = {
  id: string;
  col: number;
  row: number;
  type: SpellScrollType;
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
  hp: number;
  maxHp: number;
  wave: number;
  defenses: Defense[];
  spellScrolls: SpellScroll[];
  spellScrollCooldowns: Record<string, number>;
  foes: Foe[];
  projectiles: Projectile[];
  effects: SplashEffect[];
  damagePopups: DamagePopup[];
  selectedDefense: DefenseType | null;
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
  hp?: number;
  lives?: number;
  wave: number;
  soundEnabled: boolean;
  autoWaveEnabled?: boolean;
  showDamagePopups?: boolean;
  selectedDefenseId?: string | null;
  selectedTowerId?: string | null;
  spellScrollCooldowns?: Record<string, number>;
  trapCooldowns?: Record<string, number>;
  isCountingDown?: boolean;
  countdownRemaining?: number;
  waves?: Array<{
    id: string;
    waveNumber: number;
    spawnTimer: number;
    spawnIndex: number;
    totalSpawns: number;
    remainingFoes: number;
    bossSpawned?: boolean;
    hpLost?: boolean;
    livesLost?: boolean;
  }>;
  foes?: Array<{
    id: string;
    hp: number;
    maxHp: number;
    speed: number;
    waveId: string;
    faction: FactionId;
    type: FoeType;
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
    lastSpellScrollTile?: string;
  }>;
  enemies?: Array<{
    id: string;
    hp: number;
    maxHp: number;
    speed: number;
    waveId: string;
    faction: FactionId;
    type: FoeType;
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
  spellScrolls?: Array<{
    col: number;
    row: number;
    typeId: string;
    triggersRemaining?: number;
  }>;
  traps?: Array<{
    col: number;
    row: number;
    typeId: string;
    triggersRemaining?: number;
  }>;
  defenses: Array<{
    col: number;
    row: number;
    typeId: string;
    level?: number;
    cooldown?: number;
    targetCol?: number;
    targetRow?: number;
  }>;
  towers?: Array<{
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
  DefenseAuraBonuses,
  Foe,
  FoeType,
  FactionConfig,
  FactionId,
  GameState,
  Grid,
  PixelSprite,
  Projectile,
  SaveData,
  SplashEffect,
  DamagePopup,
  SpellScroll,
  SpellScrollSound,
  SpellScrollType,
  Defense,
  DefenseType,
  WaveState,
};
