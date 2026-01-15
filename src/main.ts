import "./style.scss";
import {
  GAME_CONFIG,
  RANGED_TREE_RANGE_BONUS,
  MAX_DEFENSE_LEVEL,
  assertDefenseRanges,
  buildPathTiles,
  clampDefenseLevel,
  createAudioSystem,
  createInitialState,
  foeSprites,
  getFactionForWave,
  getTileSize,
  getDefenseStatsAtLevel,
  getDefenseUpgradeCost,
  grid,
  isTreeTile,
  loadGame,
  pathPoints,
  saveGame,
  screenToGrid,
  tileCenter,
  spellScrollSprites,
  spellScrollTypes,
  defenseSprites,
  defenseTypes,
} from "./core";
import type {
  DamageGroup,
  DamageGroupResistances,
  DamageResistances,
  DamageType,
  FactionId,
  DefenseType,
  GameState,
  SpellScrollType,
} from "./types/core/types";
import { createPixiRenderer } from "./render/pixiRenderer";
import { isBossWave, spawnBossFoe, spawnFoe, updateFoes } from "./systems/foes";
import { updateProjectiles } from "./systems/projectiles";
import { updateSpellScrolls } from "./systems/spellScrolls";
import { updateDefenses } from "./systems/defenses";
import { startNewWave, updateCountdown, updateWaves } from "./systems/waves";
import { UiRoot, UI_TEXT, createUiState } from "./ui";
import { mount } from "svelte";
import { DEFENSE_IDS } from "./constants/defenseIds";
import { getDevConfig, isDevEnabled } from "./core/devFlags";
import { clamp } from "./utils/math";
import { applyAuraToStats, getDefenseAuraMultipliers } from "./core/defenseAuras";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const uiRoot = document.getElementById("ui-root");
if (!canvas || !uiRoot) {
  throw new Error("Required UI root elements missing");
}
document.title = UI_TEXT.pageTitle;
const mainLayout = document.querySelector<HTMLElement>(".game-stage");

const pathTiles = buildPathTiles(pathPoints);
const audio = createAudioSystem();
let renderer: Awaited<ReturnType<typeof createPixiRenderer>> | null = null;

let gameState: GameState = createInitialState();
let lastTime = 0;
let isDefeated = false;
let isLoading = false;
let isStateDirty = false;
let selectedDefenseId: string | null = null;
let recentDefenseId: string | null = null;
let recentRemainingSeconds = 0;
let dragDefenseTypeId: string | null = null;
let dragSpellScrollTypeId: string | null = null;
let dragPointer: { x: number; y: number } | null = null;
let lastPointer: { x: number; y: number } | null = null;
let isDragging = false;
let speedIndex = 0;
let pendingTargetDefenseId: string | null = null;
let currentMapWidth = 0;
let currentMapHeight = 0;
let wasWaveActive = false;

const RANGE_DISPLAY_DURATION = 2.5;
const UPGRADE_POPUP_WIDTH = 190;
const UPGRADE_POPUP_HEIGHT = 190;
const UPGRADE_POPUP_PADDING = 8;

const LEGACY_DEFENSE_ID_MAP: Record<string, string> = {
  mage: DEFENSE_IDS.wizard,
  archer: DEFENSE_IDS.ranger,
  blade: DEFENSE_IDS.fighter,
  warden: DEFENSE_IDS.paladin,
  catapult: DEFENSE_IDS.siegeEngine,
};

const normalizeDefenseId = (id: string | null) => (id ? LEGACY_DEFENSE_ID_MAP[id] ?? id : null);

const LEGACY_FACTION_ID_MAP: Record<string, string> = {
  humans: "arcane-cabal",
  humanoids: "arcane-cabal",
  orcs: "orcish-warclans",
  goblinoids: "goblin-warrens",
  elves: "feywild-host",
  fey: "feywild-host",
  undead: "necrotic-legion",
  dwarves: "giantkin-tribes",
  giants: "giantkin-tribes",
  spirits: "elemental-conclave",
  elementals: "elemental-conclave",
  demons: "abyssal-horde",
  fiends: "infernal-contract",
  dragons: "draconic-brood",
};

const VALID_FACTION_IDS: FactionId[] = [
  "necrotic-legion",
  "vampiric-court",
  "infernal-contract",
  "abyssal-horde",
  "draconic-brood",
  "elemental-conclave",
  "goblin-warrens",
  "orcish-warclans",
  "giantkin-tribes",
  "arcane-cabal",
  "illithid-dominion",
  "feywild-host",
  "verdant-circle",
  "yuan-ti-coil",
  "eldritch-beyond",
  "construct-imperium",
];

const normalizeFactionId = (id: string): FactionId => {
  const mapped = LEGACY_FACTION_ID_MAP[id] ?? id;
  return VALID_FACTION_IDS.includes(mapped as FactionId) ? (mapped as FactionId) : "necrotic-legion";
};

const mergeResistances = (
  base?: DamageResistances,
  extra?: DamageResistances,
): DamageResistances | undefined => {
  if (!base && !extra) return undefined;
  const merged: DamageResistances = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(extra ?? {})) {
    const damageType = key as DamageType;
    const prior = merged[damageType] ?? 1;
    merged[damageType] = prior * (value ?? 1);
  }
  return merged;
};

const mergeGroupResistances = (
  base?: DamageGroupResistances,
  extra?: DamageGroupResistances,
): DamageGroupResistances | undefined => {
  if (!base && !extra) return undefined;
  const merged: DamageGroupResistances = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(extra ?? {})) {
    const group = key as DamageGroup;
    const prior = merged[group] ?? 1;
    merged[group] = prior * (value ?? 1);
  }
  return merged;
};

const markStateDirty = () => {
  if (!isLoading) {
    isStateDirty = true;
  }
};

const canAfford = (cost: number) => {
  const devConfig = getDevConfig();
  if (isDevEnabled() && devConfig.infiniteGold) return true;
  return gameState.gold >= cost;
};

const getDefenseCountByType = () =>
  gameState.defenses.reduce<Record<string, number>>((counts, defense) => {
    counts[defense.type.id] = (counts[defense.type.id] ?? 0) + 1;
    return counts;
  }, {});

const getDefensePlacementCost = (defenseId: string) => {
  const defense = defenseTypes.find((item) => item.id === defenseId);
  if (!defense) return Number.POSITIVE_INFINITY;
  const placedCount = gameState.defenses.filter((item) => item.type.id === defenseId).length;
  return defense.cost + placedCount * 5;
};

const resizeCanvas = () => {
  if (!renderer) return;
  const frame = canvas.parentElement;
  const mainWidth = mainLayout?.getBoundingClientRect().width ?? frame?.clientWidth ?? canvas.clientWidth;
  const mainHeight = mainLayout?.getBoundingClientRect().height ?? frame?.clientHeight ?? canvas.clientHeight;
  canvas.style.width = `${mainWidth}px`;
  canvas.style.height = `${mainHeight}px`;
  const size = getTileSize(canvas, grid);
  const mapWidth = size * grid.cols;
  const mapHeight = size * grid.rows;
  currentMapWidth = mapWidth;
  currentMapHeight = mapHeight;
  canvas.style.width = `${mapWidth}px`;
  canvas.style.height = `${mapHeight}px`;
  if (frame) {
    frame.style.width = `${mapWidth}px`;
    frame.style.height = `${mapHeight}px`;
  }
  renderer.resizeToCanvas();
  renderer.rebuildTerrain(size, grid.cols, grid.rows);
  if (ui) {
    updateUI();
  }
};

const updateFullscreenLayout = () => {
  if (typeof document === "undefined") return;
  const isFullscreen = Boolean(document.fullscreenElement);
  document.body?.classList.toggle("is-fullscreen", isFullscreen);
  resizeCanvas();
};

assertDefenseRanges();

const canPlaceDefense = (col: number, row: number) => {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return false;
  if (pathTiles.has(`${col},${row}`)) return false;
  return !gameState.defenses.some((defense) => defense.col === col && defense.row === row);
};

const canPlaceSpellScroll = (col: number, row: number) => {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return false;
  if (!pathTiles.has(`${col},${row}`)) return false;
  if (gameState.defenses.some((defense) => defense.col === col && defense.row === row)) return false;
  if (gameState.spellScrolls.some((spellScroll) => spellScroll.col === col && spellScroll.row === row)) return false;
  return true;
};

const addDefense = (col: number, row: number, type: DefenseType, rangeBonus: number) => {
  const defaultTarget = type.id === DEFENSE_IDS.siegeEngine ? pathPoints[0] : undefined;
  const damageBonus =
    type.id === DEFENSE_IDS.ranger && isTreeTile(col, row, pathTiles)
      ? GAME_CONFIG.gameplay.rangerTreeDamageBonus
      : 0;
  const defense = {
    id: crypto.randomUUID(),
    col,
    row,
    type,
    cooldown: 0,
    rangeBonus,
    damageBonus,
    level: 0,
    targetCol: defaultTarget?.x,
    targetRow: defaultTarget?.y,
  };
  gameState.defenses.push(defense);
  markStateDirty();
  return defense;
};

const addSpellScroll = (col: number, row: number, type: SpellScrollType) => {
  const spellScroll = {
    id: crypto.randomUUID(),
    col,
    row,
    type,
    triggersRemaining: type.maxTriggers,
  };
  gameState.spellScrolls.push(spellScroll);
  markStateDirty();
  return spellScroll;
};

const setSelectedDefense = (id: string | null) => {
  gameState.selectedDefense = id ? defenseTypes.find((defense) => defense.id === id) || null : null;
  markStateDirty();
};

const startDefenseDrag = (defenseTypeId: string) => {
  dragDefenseTypeId = defenseTypeId;
  dragSpellScrollTypeId = null;
  isDragging = true;
  setSelectedDefense(defenseTypeId);
  updateUI();
};

const startSpellScrollDrag = (spellScrollTypeId: string) => {
  dragSpellScrollTypeId = spellScrollTypeId;
  dragDefenseTypeId = null;
  isDragging = true;
  selectedDefenseId = null;
  setSelectedDefense(null);
  updateUI();
};

const updateDragPointer = (event: PointerEvent) => {
  lastPointer = { x: event.clientX, y: event.clientY };
  if (!isDragging && !pendingTargetDefenseId) return;
  dragPointer = lastPointer;
};

const stopDrag = () => {
  dragDefenseTypeId = null;
  dragSpellScrollTypeId = null;
  dragPointer = null;
  isDragging = false;
  updateUI();
};

const getSpellScrollCooldown = (spellScrollId: string) => gameState.spellScrollCooldowns[spellScrollId] ?? 0;

const setSpellScrollCooldown = (spellScrollId: string, value: number) => {
  if (value <= 0) {
    delete gameState.spellScrollCooldowns[spellScrollId];
    return;
  }
  gameState.spellScrollCooldowns[spellScrollId] = value;
};

const resetPerWaveSpellScrollCooldowns = () => {
  for (const spellScroll of spellScrollTypes) {
    if (!spellScroll.cooldownPerWave) continue;
    delete gameState.spellScrollCooldowns[spellScroll.id];
  }
};

  const uiState = createUiState({
    selectedDefenseTypeId: gameState.selectedDefense?.id ?? null,
    selectedDefensePopup: null,
    gold: gameState.gold,
    hp: gameState.hp,
    wave: gameState.wave,
    foeFactionName: getFactionForWave(gameState.wave).name,
    soundEnabled: gameState.soundEnabled,
    autoWaveEnabled: gameState.autoWaveEnabled,
    showDamagePopups: gameState.showDamagePopups,
    spellScrollCooldowns: gameState.spellScrollCooldowns,
    defenseCounts: getDefenseCountByType(),
    speedMultiplier: GAME_CONFIG.gameplay.speedSteps[speedIndex],
    isCountingDown: gameState.isCountingDown,
    countdownRemaining: gameState.countdownRemaining,
    showDefeat: false,
    isDragging: false,
  mapWidth: currentMapWidth,
  mapHeight: currentMapHeight,
});
let ui: ReturnType<typeof mount> | null = null;

const buildSelectedDefensePopup = () => {
  if (!selectedDefenseId) return null;
  const defense = gameState.defenses.find((item) => item.id === selectedDefenseId);
  if (!defense) return null;
  const size = getTileSize(canvas, grid);
  const center = tileCenter(defense.col, defense.row, size);
  const mapWidth = size * grid.cols;
  const nextLevel = defense.level + 1;
  const canUpgrade = defense.level < MAX_DEFENSE_LEVEL;
  const upgradeCost = canUpgrade ? getDefenseUpgradeCost(defense, nextLevel) : 0;
  const canAffordUpgrade = canUpgrade && canAfford(upgradeCost);
  const aura = getDefenseAuraMultipliers(defense, gameState.defenses);
  const statsCurrent = applyAuraToStats(getDefenseStatsAtLevel(defense, defense.level), aura);
  const statsNext = canUpgrade
    ? applyAuraToStats(getDefenseStatsAtLevel(defense, nextLevel), aura)
    : null;
  const benefits: string[] = [];
  if (statsNext) {
    if (statsNext.damage !== statsCurrent.damage) {
      benefits.push(
        `Buff — Damage: ${statsCurrent.damage.toFixed(2)} → ${statsNext.damage.toFixed(2)}`,
      );
    }
    if (statsNext.range !== statsCurrent.range) {
      benefits.push(
        `Buff — Range: ${statsCurrent.range.toFixed(2)} → ${statsNext.range.toFixed(2)}`,
      );
    }
    if (statsNext.rate !== statsCurrent.rate) {
      benefits.push(
        `Buff — Rate: ${statsCurrent.rate.toFixed(2)} → ${statsNext.rate.toFixed(2)}`,
      );
    }
    if (statsNext.knockback !== statsCurrent.knockback) {
      benefits.push(
        `Buff — Knockback: ${statsCurrent.knockback.toFixed(2)} → ${statsNext.knockback.toFixed(2)}`,
      );
    }
    const slowConfig = defense.type.onHitSlow;
    if (slowConfig && defense.level < slowConfig.minLevel && nextLevel >= slowConfig.minLevel) {
      const slowPercent = Math.round((1 - slowConfig.multiplier) * 100);
      benefits.push(`Buff — Unlocks on-hit slow: ${slowPercent}% for ${slowConfig.duration}s`);
    }
  }

  let x = center.x + size * 0.55;
  if (x + UPGRADE_POPUP_WIDTH > mapWidth - UPGRADE_POPUP_PADDING) {
    x = center.x - size * 0.55 - UPGRADE_POPUP_WIDTH;
  }
  x = clamp(x, UPGRADE_POPUP_PADDING, mapWidth - UPGRADE_POPUP_WIDTH - UPGRADE_POPUP_PADDING);

  let y = center.y - UPGRADE_POPUP_HEIGHT * 0.5;

  return {
    id: defense.id,
    typeId: defense.type.id,
    name: defense.type.name,
    types: defense.type.types,
    level: defense.level,
    maxLevel: MAX_DEFENSE_LEVEL,
    targetCol: defense.targetCol,
    targetRow: defense.targetRow,
    x,
    y,
    canUpgrade,
    canAfford: canAffordUpgrade,
    upgradeCost,
    statsCurrent: {
      damage: statsCurrent.damage,
      range: statsCurrent.range,
      rate: statsCurrent.rate,
      knockback: statsCurrent.knockback,
    },
    statsNext: statsNext
      ? {
          damage: statsNext.damage,
          range: statsNext.range,
          rate: statsNext.rate,
          knockback: statsNext.knockback,
        }
      : null,
    benefits,
  };
};

  const updateUI = () => {
    if (!ui) return;
    uiState.set({
      selectedDefenseTypeId: gameState.selectedDefense?.id ?? null,
      selectedDefensePopup: buildSelectedDefensePopup(),
      gold: gameState.gold,
      hp: gameState.hp,
      wave: gameState.wave,
      foeFactionName: getFactionForWave(gameState.wave).name,
    soundEnabled: gameState.soundEnabled,
    autoWaveEnabled: gameState.autoWaveEnabled,
    showDamagePopups: gameState.showDamagePopups,
    spellScrollCooldowns: gameState.spellScrollCooldowns,
    defenseCounts: getDefenseCountByType(),
    speedMultiplier: GAME_CONFIG.gameplay.speedSteps[speedIndex],
      isCountingDown: gameState.isCountingDown,
      countdownRemaining: gameState.countdownRemaining,
      showDefeat: isDefeated,
      isDragging,
      mapWidth: currentMapWidth,
      mapHeight: currentMapHeight,
    });
  };

const resetGame = () => {
  gameState = createInitialState();
  isDefeated = false;
  selectedDefenseId = null;
  recentDefenseId = null;
  recentRemainingSeconds = 0;
  pendingTargetDefenseId = null;
  wasWaveActive = false;
  setSelectedDefense(defenseTypes[0].id);
  markStateDirty();
  updateUI();
};

const startWave = () => {
  if (gameState.isCountingDown || isDefeated) return;
  startNewWave(gameState);
  gameState.isCountingDown = true;
  gameState.countdownRemaining = GAME_CONFIG.gameplay.countdownSeconds;
  markStateDirty();
};

const initUi = () => {
  ui = mount(UiRoot, {
    target: uiRoot,
    props: {
      uiState,
      defenseTypes,
      defenseSprites,
      spellScrollTypes,
      spellScrollSprites,
      onStartWave: () => {
        audio.unlock();
        startWave();
        updateUI();
      },
      onResetGame: () => {
        audio.unlock();
        resetGame();
      },
      onToggleSound: () => {
        audio.unlock();
        gameState.soundEnabled = !gameState.soundEnabled;
        markStateDirty();
        updateUI();
      },
      onToggleAutoWave: () => {
        gameState.autoWaveEnabled = !gameState.autoWaveEnabled;
        markStateDirty();
        updateUI();
      },
      onToggleDamagePopups: () => {
        gameState.showDamagePopups = !gameState.showDamagePopups;
        if (!gameState.showDamagePopups) {
          gameState.damagePopups.length = 0;
        }
        markStateDirty();
        updateUI();
      },
      onToggleSpeed: () => {
        speedIndex = (speedIndex + 1) % GAME_CONFIG.gameplay.speedSteps.length;
        updateUI();
      },
      onSelectDefense: (defenseId: string | null) => {
        setSelectedDefense(defenseId);
        updateUI();
      },
      onStartDragDefense: (defenseId: string) => {
        startDefenseDrag(defenseId);
        updateUI();
      },
      onStartDragSpellScroll: (spellScrollId: string) => {
        if (getSpellScrollCooldown(spellScrollId) > 0) return;
        startSpellScrollDrag(spellScrollId);
        updateUI();
      },
      onUpgradeDefense: (defenseId: string) => {
        const defense = gameState.defenses.find((item) => item.id === defenseId);
        if (!defense) return;
        if (defense.level >= MAX_DEFENSE_LEVEL) return;
        const nextLevel = defense.level + 1;
        const upgradeCost = getDefenseUpgradeCost(defense, nextLevel);
        if (!canAfford(upgradeCost)) return;
        if (!(isDevEnabled() && getDevConfig().infiniteGold)) {
          gameState.gold -= upgradeCost;
        }
        defense.level = nextLevel;
        markStateDirty();
        updateUI();
      },
      onDeleteDefense: (defenseId: string) => {
        const index = gameState.defenses.findIndex((item) => item.id === defenseId);
        if (index === -1) return;
        gameState.defenses.splice(index, 1);
        if (selectedDefenseId === defenseId) {
          selectedDefenseId = null;
        }
        if (pendingTargetDefenseId === defenseId) {
          pendingTargetDefenseId = null;
        }
        markStateDirty();
        updateUI();
      },
      onSetDefenseTarget: (defenseId: string) => {
        pendingTargetDefenseId = defenseId;
        dragPointer = lastPointer;
      },
      onCloseDefensePopup: () => {
        selectedDefenseId = null;
        updateUI();
      },
      onDefeatReset: () => {
        resetGame();
      },
    },
  });
  updateUI();
};

const handlePointer = (event: PointerEvent) => {
  const rect = canvas.getBoundingClientRect();
  const size = getTileSize(canvas, grid);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { col, row } = screenToGrid(x, y, size);
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) {
    pendingTargetDefenseId = null;
    return;
  }
  if (pendingTargetDefenseId) {
    const defense = gameState.defenses.find((item) => item.id === pendingTargetDefenseId);
    if (defense) {
      const center = tileCenter(defense.col, defense.row, size);
      const targetCenter = tileCenter(col, row, size);
      const dist = Math.hypot(targetCenter.x - center.x, targetCenter.y - center.y);
      const range = getDefenseStatsAtLevel(defense, defense.level).range * size;
      if (dist <= range) {
        defense.targetCol = col;
        defense.targetRow = row;
        markStateDirty();
        updateUI();
      }
    }
    pendingTargetDefenseId = null;
    dragPointer = null;
    return;
  }
  const defenseAtTile = gameState.defenses.find((defense) => defense.col === col && defense.row === row);
  if (defenseAtTile) {
    selectedDefenseId = defenseAtTile.id;
    return;
  }
  selectedDefenseId = null;
};

const loadSavedGame = () => {
  const data = loadGame();
  if (!data) {
    setSelectedDefense(defenseTypes[0].id);
    updateUI();
    return;
  }
  gameState.gold = data.gold ?? gameState.gold;
  gameState.hp = data.hp ?? gameState.hp;
  gameState.hp = Math.min(gameState.hp, gameState.maxHp);
  gameState.wave = data.wave ?? gameState.wave;
  gameState.isCountingDown = data.isCountingDown ?? gameState.isCountingDown;
  gameState.countdownRemaining = data.countdownRemaining ?? gameState.countdownRemaining;
  gameState.soundEnabled = data.soundEnabled ?? gameState.soundEnabled;
  gameState.autoWaveEnabled = data.autoWaveEnabled ?? gameState.autoWaveEnabled;
  gameState.showDamagePopups = data.showDamagePopups ?? gameState.showDamagePopups;
  gameState.spellScrollCooldowns = {};
  if (data.spellScrollCooldowns) {
    for (const [spellScrollId, remaining] of Object.entries(data.spellScrollCooldowns)) {
      gameState.spellScrollCooldowns[spellScrollId] = remaining < 0 ? Number.POSITIVE_INFINITY : remaining;
    }
  }
  gameState.spellScrolls = Array.isArray(data.spellScrolls)
    ? data.spellScrolls
        .map((spellScroll) => {
          const type = spellScrollTypes.find((candidate) => candidate.id === spellScroll.typeId);
          if (!type) return null;
          return {
            id: crypto.randomUUID(),
            col: spellScroll.col,
            row: spellScroll.row,
            type,
            triggersRemaining: spellScroll.triggersRemaining ?? type.maxTriggers,
          };
        })
        .filter((spellScroll): spellScroll is NonNullable<typeof spellScroll> => Boolean(spellScroll))
    : [];
  gameState.defenses = Array.isArray(data.defenses)
    ? data.defenses
        .map((defense) => {
          const resolvedId = normalizeDefenseId(defense.typeId);
          const type = defenseTypes.find((candidate) => candidate.id === resolvedId);
          if (!type) return null;
          return {
            id: crypto.randomUUID(),
            col: defense.col,
            row: defense.row,
            type,
            cooldown: defense.cooldown ?? 0,
            rangeBonus:
              type.types.includes("Ranged") && isTreeTile(defense.col, defense.row, pathTiles)
                ? RANGED_TREE_RANGE_BONUS
                : 0,
            damageBonus:
              type.id === DEFENSE_IDS.ranger && isTreeTile(defense.col, defense.row, pathTiles)
                ? GAME_CONFIG.gameplay.rangerTreeDamageBonus
                : 0,
            level: clampDefenseLevel(defense.level ?? 0),
            targetCol: defense.targetCol,
            targetRow: defense.targetRow,
          };
        })
        .filter((defense): defense is NonNullable<typeof defense> => Boolean(defense))
    : [];
  gameState.waves = Array.isArray(data.waves)
    ? data.waves.map((wave) => {
        const legacyRemaining = "remainingEnemies" in wave ? (wave as { remainingEnemies?: number }).remainingEnemies : undefined;
        return {
          id: wave.id,
          waveNumber: wave.waveNumber,
          spawnTimer: wave.spawnTimer,
          spawnIndex: wave.spawnIndex,
          totalSpawns: wave.totalSpawns,
          remainingFoes: wave.remainingFoes ?? legacyRemaining ?? 0,
          bossSpawned: wave.bossSpawned,
          hpLost: wave.hpLost,
        };
      })
    : [];
  const waveNumberById = new Map(gameState.waves.map((wave) => [wave.id, wave.waveNumber]));
  gameState.foes = Array.isArray(data.foes)
    ? data.foes.map((foe) => {
        const waveNumber = waveNumberById.get(foe.waveId);
        const factionId = waveNumber ? getFactionForWave(waveNumber).id : normalizeFactionId(foe.faction);
        const factionResistances = GAME_CONFIG.foe.factionResistances?.[factionId as keyof typeof GAME_CONFIG.foe.factionResistances];
        const factionGroupResistances = GAME_CONFIG.foe.factionGroupResistances?.[
          factionId as keyof typeof GAME_CONFIG.foe.factionGroupResistances
        ];
        const isBoss = foe.isBoss || foe.type === "boss";
        const typeStats = isBoss ? null : GAME_CONFIG.foe.types[foe.type];
        return {
          id: foe.id,
          hp: foe.hp,
          maxHp: foe.maxHp,
          speed: foe.speed,
          waveId: foe.waveId,
          faction: factionId,
          type: foe.type,
          targetIndex: foe.targetIndex,
          isBoss: foe.isBoss,
          sizeScale: foe.sizeScale,
          x: foe.x,
          y: foe.y,
          vx: foe.vx,
          vy: foe.vy,
          knockbackRemaining: foe.knockbackRemaining,
          knockbackResistRemaining: foe.knockbackResistRemaining,
          slowRemaining: foe.slowRemaining,
          slowMultiplier: foe.slowMultiplier,
          lastSpellScrollTile: foe.lastSpellScrollTile,
          damageResistances: isBoss
            ? mergeResistances(GAME_CONFIG.foe.bossDamageResistances, factionResistances)
            : mergeResistances(typeStats?.damageResistances, factionResistances),
          damageGroupResistances: isBoss
            ? mergeGroupResistances(GAME_CONFIG.foe.bossDamageGroupResistances, factionGroupResistances)
            : mergeGroupResistances(typeStats?.damageGroupResistances, factionGroupResistances),
        };
      })
    : [];
  wasWaveActive = gameState.waves.length > 0 || gameState.isCountingDown;

  const preferredId = normalizeDefenseId(data.selectedDefenseId ?? defenseTypes[0].id);
  const selectedId = defenseTypes.some((defense) => defense.id === preferredId) ? preferredId : defenseTypes[0].id;
  setSelectedDefense(selectedId);
  updateUI();
};

const loop = (timestamp: number) => {
  if (!renderer) {
    requestAnimationFrame(loop);
    return;
  }
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0;
  lastTime = timestamp;
  const scaledDt = dt * GAME_CONFIG.gameplay.speedSteps[speedIndex];
  const size = getTileSize(canvas, grid);
  let targetIndicator: { x: number; y: number; alpha?: number } | undefined;
  let highlightAlpha = 0;
  let highlightDefenseId: string | null = null;
  if (selectedDefenseId) {
    highlightDefenseId = selectedDefenseId;
    highlightAlpha = 1;
  } else if (recentDefenseId) {
    recentRemainingSeconds = Math.max(recentRemainingSeconds - scaledDt, 0);
    highlightAlpha = Math.min(recentRemainingSeconds / RANGE_DISPLAY_DURATION, 1);
    highlightDefenseId = recentDefenseId;
    if (recentRemainingSeconds === 0) {
      recentDefenseId = null;
    }
  }
  const dragPreview =
    dragPointer && dragDefenseTypeId
      ? (() => {
          const rect = canvas.getBoundingClientRect();
          const localX = dragPointer.x - rect.left;
          const localY = dragPointer.y - rect.top;
          if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
            return null;
          }
          const defense = defenseTypes.find((item) => item.id === dragDefenseTypeId);
          if (!defense) return null;
          const { col, row } = screenToGrid(localX, localY, size);
          const rangeBonus =
            defense.types.includes("Ranged") && isTreeTile(col, row, pathTiles) ? RANGED_TREE_RANGE_BONUS : 0;
          return {
            x: localX,
            y: localY,
            range: defense.range + rangeBonus,
            color: defense.color,
            spriteId: defense.id,
          };
        })()
      : null;

  const spellScrollPreview =
    dragPointer && dragSpellScrollTypeId
      ? (() => {
          const rect = canvas.getBoundingClientRect();
          const localX = dragPointer.x - rect.left;
          const localY = dragPointer.y - rect.top;
          if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
            return null;
          }
          const spellScroll = spellScrollTypes.find((item) => item.id === dragSpellScrollTypeId);
          if (!spellScroll) return null;
          const radius =
            spellScroll.killsAll ? Math.hypot(grid.cols, grid.rows) : spellScroll.splashRadiusTiles ?? undefined;
          return {
            x: localX,
            y: localY,
            radius,
            spriteId: spellScroll.id,
          };
        })()
      : null;

  if (pendingTargetDefenseId) {
    const defense = gameState.defenses.find((item) => item.id === pendingTargetDefenseId);
    if (defense && dragPointer) {
      const rect = canvas.getBoundingClientRect();
      const localX = dragPointer.x - rect.left;
      const localY = dragPointer.y - rect.top;
      if (localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height) {
        const { col, row } = screenToGrid(localX, localY, size);
        if (col >= 0 && row >= 0 && col < grid.cols && row < grid.rows) {
          const targetCenter = tileCenter(col, row, size);
          targetIndicator = { x: targetCenter.x, y: targetCenter.y, alpha: 0.95 };
        }
      }
    }
  } else if (selectedDefenseId) {
    const defense = gameState.defenses.find((item) => item.id === selectedDefenseId);
    if (defense && defense.type.id === DEFENSE_IDS.siegeEngine) {
      if (defense.targetCol !== undefined && defense.targetRow !== undefined) {
        const targetCenter = tileCenter(defense.targetCol, defense.targetRow, size);
        targetIndicator = { x: targetCenter.x, y: targetCenter.y, alpha: 0.75 };
      }
    }
  }

  if (gameState.hp <= 0) {
    if (!isDefeated) {
      isDefeated = true;
      markStateDirty();
    }
    renderer.updateFrame({
      size,
      cols: grid.cols,
      rows: grid.rows,
      defenses: gameState.defenses,
      spellScrolls: gameState.spellScrolls,
      foes: gameState.foes,
      projectiles: gameState.projectiles,
      effects: gameState.effects,
      damagePopups: gameState.damagePopups,
      highlightedDefenseId: highlightDefenseId,
      highlightAlpha,
      dragPreview: dragPreview ?? undefined,
      spellScrollPreview: spellScrollPreview ?? undefined,
      targetIndicator,
    });
    updateUI();
    if (isStateDirty) {
      saveGame(gameState);
      isStateDirty = false;
    }
    requestAnimationFrame(loop);
    return;
  }

  updateCountdown(gameState, scaledDt);
  for (const [spellScrollId, remaining] of Object.entries(gameState.spellScrollCooldowns)) {
    if (!Number.isFinite(remaining)) continue;
    const next = Math.max(0, remaining - scaledDt);
    setSpellScrollCooldown(spellScrollId, next);
  }
  updateWaves(
    gameState,
    scaledDt,
    (wave) => spawnFoe(gameState, wave),
    (wave) => spawnBossFoe(gameState, wave),
    isBossWave,
    markStateDirty,
  );
  const isWaveActive = gameState.waves.length > 0 || gameState.isCountingDown;
  if (wasWaveActive && !isWaveActive) {
    resetPerWaveSpellScrollCooldowns();
  }
  wasWaveActive = isWaveActive;
  if (gameState.autoWaveEnabled && !gameState.isCountingDown && gameState.waves.length === 0) {
    startWave();
  }
  updateFoes(gameState, scaledDt, size, markStateDirty);
  updateSpellScrolls(gameState, scaledDt, size, grid.cols, grid.rows, markStateDirty, (soundEffect) =>
    audio.playSpellScrollSound(soundEffect, gameState.soundEnabled),
  );
  updateDefenses(gameState, scaledDt, size);
  updateProjectiles(
    gameState,
    scaledDt,
    (defenseTypeId) => audio.playDamageSound(defenseTypeId, gameState.soundEnabled),
    gameState.showDamagePopups,
  );
  for (let i = gameState.effects.length - 1; i >= 0; i -= 1) {
    const effect = gameState.effects[i];
    effect.time += scaledDt;
    if (effect.time >= effect.duration) {
      gameState.effects.splice(i, 1);
    }
  }
  for (let i = gameState.damagePopups.length - 1; i >= 0; i -= 1) {
    const popup = gameState.damagePopups[i];
    popup.time += scaledDt;
    if (popup.time >= popup.duration) {
      gameState.damagePopups.splice(i, 1);
    }
  }

  renderer.updateFrame({
    size,
    cols: grid.cols,
    rows: grid.rows,
    defenses: gameState.defenses,
    spellScrolls: gameState.spellScrolls,
    foes: gameState.foes,
    projectiles: gameState.projectiles,
    effects: gameState.effects,
    damagePopups: gameState.damagePopups,
    highlightedDefenseId: highlightDefenseId,
    highlightAlpha,
    dragPreview: dragPreview ?? undefined,
    spellScrollPreview: spellScrollPreview ?? undefined,
    targetIndicator,
  });

  updateUI();

  if (isStateDirty) {
    saveGame(gameState);
    isStateDirty = false;
  }

  requestAnimationFrame(loop);
};

const startApp = async () => {
  renderer = await createPixiRenderer({ canvas, pathTiles, defenseSprites, spellScrollSprites, foeSprites });
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("fullscreenchange", updateFullscreenLayout);
  updateFullscreenLayout();

  initUi();

  isLoading = true;
  loadSavedGame();
  isLoading = false;
  updateUI();

  canvas.addEventListener("pointerdown", (event) => {
    audio.unlock();
    canvas.setPointerCapture(event.pointerId);
    handlePointer(event);
  });

  window.addEventListener("pointermove", (event) => {
    updateDragPointer(event);
  });

  window.addEventListener("pointerup", (event) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const size = getTileSize(canvas, grid);
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    if (localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height) {
      const { col, row } = screenToGrid(localX, localY, size);
      if (dragDefenseTypeId) {
        const defense = defenseTypes.find((item) => item.id === dragDefenseTypeId);
        const placementCost = defense ? getDefensePlacementCost(defense.id) : Number.POSITIVE_INFINITY;
        if (defense && canPlaceDefense(col, row) && canAfford(placementCost)) {
          const rangeBonus =
            defense.types.includes("Ranged") && isTreeTile(col, row, pathTiles) ? RANGED_TREE_RANGE_BONUS : 0;
          const placedDefense = addDefense(col, row, defense, rangeBonus);
          if (!(isDevEnabled() && getDevConfig().infiniteGold)) {
            gameState.gold -= placementCost;
          }
          recentDefenseId = placedDefense.id;
          recentRemainingSeconds = RANGE_DISPLAY_DURATION;
        }
      } else if (dragSpellScrollTypeId) {
        const spellScroll = spellScrollTypes.find((item) => item.id === dragSpellScrollTypeId);
        if (spellScroll && canPlaceSpellScroll(col, row) && canAfford(spellScroll.cost)) {
          addSpellScroll(col, row, spellScroll);
          if (spellScroll.cooldownPerWave) {
            setSpellScrollCooldown(spellScroll.id, Number.POSITIVE_INFINITY);
          } else if (spellScroll.cooldownSeconds) {
            setSpellScrollCooldown(spellScroll.id, spellScroll.cooldownSeconds);
          }
          if (!(isDevEnabled() && getDevConfig().infiniteGold)) {
            gameState.gold -= spellScroll.cost;
          }
        }
      }
    }
    stopDrag();
  });

  requestAnimationFrame(loop);
};

void startApp();
