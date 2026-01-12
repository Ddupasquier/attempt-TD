import "./style.scss";
import {
  RANGED_TREE_RANGE_BONUS,
  MAX_TOWER_LEVEL,
  assertTowerRanges,
  buildPathTiles,
  clampTowerLevel,
  createAudioSystem,
  createInitialState,
  enemySprites,
  getFactionForWave,
  getTileSize,
  getTowerStatsAtLevel,
  getTowerUpgradeCost,
  grid,
  isTreeTile,
  loadGame,
  pathPoints,
  saveGame,
  screenToGrid,
  tileCenter,
  towerSprites,
  towerTypes,
} from "./core";
import type { GameState, TowerType } from "./types/core/types";
import { createPixiRenderer } from "./render/pixiRenderer";
import { isBossWave, spawnBossEnemy, spawnEnemy, updateEnemies } from "./systems/enemies";
import { updateProjectiles } from "./systems/projectiles";
import { updateTowers } from "./systems/towers";
import { startNewWave, updateCountdown, updateWaves } from "./systems/waves";
import { UiRoot, UI_TEXT, createUiState } from "./ui";
import { mount } from "svelte";
import { TOWER_IDS } from "./constants/towerIds";
import { clamp } from "./utils/math";

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
let selectedTowerId: string | null = null;
let recentTowerId: string | null = null;
let recentRemainingSeconds = 0;
let dragTowerTypeId: string | null = null;
let dragPointer: { x: number; y: number } | null = null;
let lastPointer: { x: number; y: number } | null = null;
let isDragging = false;
let speedIndex = 0;
let pendingTargetTowerId: string | null = null;
let currentMapWidth = 0;
let currentMapHeight = 0;

const SPEED_STEPS = [1, 1.5, 2];

const RANGE_DISPLAY_DURATION = 2.5;
const UPGRADE_POPUP_WIDTH = 190;
const UPGRADE_POPUP_HEIGHT = 190;
const UPGRADE_POPUP_PADDING = 8;

const markStateDirty = () => {
  if (!isLoading) {
    isStateDirty = true;
  }
};

const resizeCanvas = () => {
  if (!renderer) return;
  const frame = canvas.parentElement;
  const mainWidth = mainLayout?.getBoundingClientRect().width ?? frame?.clientWidth ?? canvas.clientWidth;
  const mainHeight = mainLayout?.getBoundingClientRect().height ?? frame?.clientHeight ?? canvas.clientHeight;
  const sizeFromWidth = mainWidth > 0 ? mainWidth / grid.cols : getTileSize(canvas, grid);
  const sizeFromHeight = mainHeight > 0 ? mainHeight / grid.rows : sizeFromWidth;
  const size = Math.min(sizeFromWidth, sizeFromHeight);
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

assertTowerRanges();

const canPlaceTower = (col: number, row: number) => {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return false;
  if (pathTiles.has(`${col},${row}`)) return false;
  return !gameState.towers.some((tower) => tower.col === col && tower.row === row);
};

const addTower = (col: number, row: number, type: TowerType, rangeBonus: number) => {
  const defaultTarget = type.id === TOWER_IDS.catapult ? pathPoints[0] : undefined;
  const tower = {
    id: crypto.randomUUID(),
    col,
    row,
    type,
    cooldown: 0,
    rangeBonus,
    level: 0,
    targetCol: defaultTarget?.x,
    targetRow: defaultTarget?.y,
  };
  gameState.towers.push(tower);
  markStateDirty();
  return tower;
};

const setSelectedTower = (id: string | null) => {
  gameState.selectedTower = id ? towerTypes.find((tower) => tower.id === id) || null : null;
  markStateDirty();
};

const startTowerDrag = (towerTypeId: string) => {
  dragTowerTypeId = towerTypeId;
  isDragging = true;
  setSelectedTower(towerTypeId);
  updateUI();
};

const updateDragPointer = (event: PointerEvent) => {
  lastPointer = { x: event.clientX, y: event.clientY };
  if (!isDragging && !pendingTargetTowerId) return;
  dragPointer = lastPointer;
};

const stopTowerDrag = () => {
  dragTowerTypeId = null;
  dragPointer = null;
  isDragging = false;
  updateUI();
};

const uiState = createUiState({
  selectedTowerTypeId: gameState.selectedTower?.id ?? null,
  selectedTowerPopup: null,
  gold: gameState.gold,
  lives: gameState.lives,
  wave: gameState.wave,
  enemyFactionName: getFactionForWave(gameState.wave).name,
  soundEnabled: gameState.soundEnabled,
  autoWaveEnabled: gameState.autoWaveEnabled,
  speedMultiplier: SPEED_STEPS[speedIndex],
  isCountingDown: gameState.isCountingDown,
  countdownRemaining: gameState.countdownRemaining,
  showDefeat: false,
  isDragging: false,
  mapWidth: currentMapWidth,
  mapHeight: currentMapHeight,
});
let ui: ReturnType<typeof mount> | null = null;

const buildSelectedTowerPopup = () => {
  if (!selectedTowerId) return null;
  const tower = gameState.towers.find((item) => item.id === selectedTowerId);
  if (!tower) return null;
  const size = getTileSize(canvas, grid);
  const center = tileCenter(tower.col, tower.row, size);
  const mapWidth = size * grid.cols;
  const nextLevel = tower.level + 1;
  const canUpgrade = tower.level < MAX_TOWER_LEVEL;
  const upgradeCost = canUpgrade ? getTowerUpgradeCost(tower, nextLevel) : 0;
  const canAfford = canUpgrade && gameState.gold >= upgradeCost;
  const statsCurrent = getTowerStatsAtLevel(tower, tower.level);
  const statsNext = canUpgrade ? getTowerStatsAtLevel(tower, nextLevel) : null;

  let x = center.x + size * 0.55;
  if (x + UPGRADE_POPUP_WIDTH > mapWidth - UPGRADE_POPUP_PADDING) {
    x = center.x - size * 0.55 - UPGRADE_POPUP_WIDTH;
  }
  x = clamp(x, UPGRADE_POPUP_PADDING, mapWidth - UPGRADE_POPUP_WIDTH - UPGRADE_POPUP_PADDING);

  let y = center.y - UPGRADE_POPUP_HEIGHT * 0.5;

  return {
    id: tower.id,
    typeId: tower.type.id,
    name: tower.type.name,
    level: tower.level,
    maxLevel: MAX_TOWER_LEVEL,
    targetCol: tower.targetCol,
    targetRow: tower.targetRow,
    x,
    y,
    canUpgrade,
    canAfford,
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
  };
};

const updateUI = () => {
  if (!ui) return;
  uiState.set({
    selectedTowerTypeId: gameState.selectedTower?.id ?? null,
    selectedTowerPopup: buildSelectedTowerPopup(),
    gold: gameState.gold,
    lives: gameState.lives,
    wave: gameState.wave,
    enemyFactionName: getFactionForWave(gameState.wave).name,
    soundEnabled: gameState.soundEnabled,
    autoWaveEnabled: gameState.autoWaveEnabled,
    speedMultiplier: SPEED_STEPS[speedIndex],
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
  selectedTowerId = null;
  recentTowerId = null;
  recentRemainingSeconds = 0;
  pendingTargetTowerId = null;
  setSelectedTower(towerTypes[0].id);
  markStateDirty();
  updateUI();
};

const startWave = () => {
  if (gameState.isCountingDown || isDefeated) return;
  startNewWave(gameState);
  gameState.isCountingDown = true;
  gameState.countdownRemaining = 5;
  markStateDirty();
};

const initUi = () => {
  ui = mount(UiRoot, {
    target: uiRoot,
    props: {
      uiState,
      towerTypes,
      towerSprites,
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
      onToggleSpeed: () => {
        speedIndex = (speedIndex + 1) % SPEED_STEPS.length;
        updateUI();
      },
      onSelectTower: (towerId: string | null) => {
        setSelectedTower(towerId);
        updateUI();
      },
      onStartDragTower: (towerId: string) => {
        startTowerDrag(towerId);
        updateUI();
      },
      onUpgradeTower: (towerId: string) => {
        const tower = gameState.towers.find((item) => item.id === towerId);
        if (!tower) return;
        if (tower.level >= MAX_TOWER_LEVEL) return;
        const nextLevel = tower.level + 1;
        const upgradeCost = getTowerUpgradeCost(tower, nextLevel);
        if (gameState.gold < upgradeCost) return;
        gameState.gold -= upgradeCost;
        tower.level = nextLevel;
        markStateDirty();
        updateUI();
      },
      onDeleteTower: (towerId: string) => {
        const index = gameState.towers.findIndex((item) => item.id === towerId);
        if (index === -1) return;
        gameState.towers.splice(index, 1);
        if (selectedTowerId === towerId) {
          selectedTowerId = null;
        }
        if (pendingTargetTowerId === towerId) {
          pendingTargetTowerId = null;
        }
        markStateDirty();
        updateUI();
      },
      onSetTowerTarget: (towerId: string) => {
        pendingTargetTowerId = towerId;
        dragPointer = lastPointer;
      },
      onCloseTowerPopup: () => {
        selectedTowerId = null;
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
    pendingTargetTowerId = null;
    return;
  }
  if (pendingTargetTowerId) {
    const tower = gameState.towers.find((item) => item.id === pendingTargetTowerId);
    if (tower) {
      const center = tileCenter(tower.col, tower.row, size);
      const targetCenter = tileCenter(col, row, size);
      const dist = Math.hypot(targetCenter.x - center.x, targetCenter.y - center.y);
      const range = getTowerStatsAtLevel(tower, tower.level).range * size;
      if (dist <= range) {
        tower.targetCol = col;
        tower.targetRow = row;
        markStateDirty();
        updateUI();
      }
    }
    pendingTargetTowerId = null;
    dragPointer = null;
    return;
  }
  const towerAtTile = gameState.towers.find((tower) => tower.col === col && tower.row === row);
  if (towerAtTile) {
    selectedTowerId = towerAtTile.id;
    return;
  }
  selectedTowerId = null;
};

const loadSavedGame = () => {
  const data = loadGame();
  if (!data) {
    setSelectedTower(towerTypes[0].id);
    updateUI();
    return;
  }
  gameState.gold = data.gold ?? gameState.gold;
  gameState.lives = data.lives ?? gameState.lives;
  gameState.lives = Math.min(gameState.lives, gameState.maxLives);
  gameState.wave = data.wave ?? gameState.wave;
  gameState.soundEnabled = data.soundEnabled ?? gameState.soundEnabled;
  gameState.autoWaveEnabled = data.autoWaveEnabled ?? gameState.autoWaveEnabled;
  gameState.towers = Array.isArray(data.towers)
    ? data.towers
        .map((tower) => {
          const type = towerTypes.find((candidate) => candidate.id === tower.typeId);
          if (!type) return null;
          return {
            id: crypto.randomUUID(),
            col: tower.col,
            row: tower.row,
            type,
            cooldown: 0,
            rangeBonus:
              type.types.includes("Ranged") && isTreeTile(tower.col, tower.row, pathTiles)
                ? RANGED_TREE_RANGE_BONUS
                : 0,
            level: clampTowerLevel(tower.level ?? 0),
            targetCol: tower.targetCol,
            targetRow: tower.targetRow,
          };
        })
        .filter((tower): tower is NonNullable<typeof tower> => Boolean(tower))
    : [];

  const preferredId = data.selectedTowerId ?? towerTypes[0].id;
  const selectedId = towerTypes.some((tower) => tower.id === preferredId) ? preferredId : towerTypes[0].id;
  setSelectedTower(selectedId);
  updateUI();
};

const loop = (timestamp: number) => {
  if (!renderer) {
    requestAnimationFrame(loop);
    return;
  }
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0;
  lastTime = timestamp;
  const scaledDt = dt * SPEED_STEPS[speedIndex];
  const size = getTileSize(canvas, grid);
  let targetIndicator: { x: number; y: number; alpha?: number } | undefined;
  let highlightAlpha = 0;
  let highlightTowerId: string | null = null;
  if (selectedTowerId) {
    highlightTowerId = selectedTowerId;
    highlightAlpha = 1;
  } else if (recentTowerId) {
    recentRemainingSeconds = Math.max(recentRemainingSeconds - scaledDt, 0);
    highlightAlpha = Math.min(recentRemainingSeconds / RANGE_DISPLAY_DURATION, 1);
    highlightTowerId = recentTowerId;
    if (recentRemainingSeconds === 0) {
      recentTowerId = null;
    }
  }
  const dragPreview =
    dragPointer && dragTowerTypeId
      ? (() => {
          const rect = canvas.getBoundingClientRect();
          const localX = dragPointer.x - rect.left;
          const localY = dragPointer.y - rect.top;
          if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) {
            return null;
          }
          const tower = towerTypes.find((item) => item.id === dragTowerTypeId);
          if (!tower) return null;
          const { col, row } = screenToGrid(localX, localY, size);
          const rangeBonus =
            tower.types.includes("Ranged") && isTreeTile(col, row, pathTiles) ? RANGED_TREE_RANGE_BONUS : 0;
          return {
            x: localX,
            y: localY,
            range: tower.range + rangeBonus,
            color: tower.color,
            spriteId: tower.id,
          };
        })()
      : null;

  if (pendingTargetTowerId) {
    const tower = gameState.towers.find((item) => item.id === pendingTargetTowerId);
    if (tower && dragPointer) {
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
  } else if (selectedTowerId) {
    const tower = gameState.towers.find((item) => item.id === selectedTowerId);
    if (tower && tower.type.id === TOWER_IDS.catapult) {
      if (tower.targetCol !== undefined && tower.targetRow !== undefined) {
        const targetCenter = tileCenter(tower.targetCol, tower.targetRow, size);
        targetIndicator = { x: targetCenter.x, y: targetCenter.y, alpha: 0.75 };
      }
    }
  }

  if (gameState.lives <= 0) {
    if (!isDefeated) {
      isDefeated = true;
      markStateDirty();
    }
    renderer.updateFrame({
      size,
      cols: grid.cols,
      rows: grid.rows,
      towers: gameState.towers,
      enemies: gameState.enemies,
      projectiles: gameState.projectiles,
      effects: gameState.effects,
      highlightedTowerId: highlightTowerId,
      highlightAlpha,
      dragPreview: dragPreview ?? undefined,
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
  updateWaves(
    gameState,
    scaledDt,
    (wave) => spawnEnemy(gameState, wave),
    (wave) => spawnBossEnemy(gameState, wave),
    isBossWave,
    markStateDirty,
  );
  if (gameState.autoWaveEnabled && !gameState.isCountingDown && gameState.waves.length === 0) {
    startWave();
  }
  updateEnemies(gameState, scaledDt, size, markStateDirty);
  updateTowers(gameState, scaledDt, size);
  updateProjectiles(gameState, scaledDt, (towerTypeId) => audio.playDamageSound(towerTypeId, gameState.soundEnabled));
  for (let i = gameState.effects.length - 1; i >= 0; i -= 1) {
    const effect = gameState.effects[i];
    effect.time += scaledDt;
    if (effect.time >= effect.duration) {
      gameState.effects.splice(i, 1);
    }
  }

  renderer.updateFrame({
    size,
    cols: grid.cols,
    rows: grid.rows,
    towers: gameState.towers,
    enemies: gameState.enemies,
    projectiles: gameState.projectiles,
    effects: gameState.effects,
    highlightedTowerId: highlightTowerId,
    highlightAlpha,
    dragPreview: dragPreview ?? undefined,
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
  renderer = await createPixiRenderer({ canvas, pathTiles, towerSprites, enemySprites });
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
      const tower = towerTypes.find((item) => item.id === dragTowerTypeId);
      if (tower && canPlaceTower(col, row) && gameState.gold >= tower.cost) {
          const rangeBonus =
            tower.types.includes("Ranged") && isTreeTile(col, row, pathTiles) ? RANGED_TREE_RANGE_BONUS : 0;
        const placedTower = addTower(col, row, tower, rangeBonus);
        gameState.gold -= tower.cost;
        recentTowerId = placedTower.id;
        recentRemainingSeconds = RANGE_DISPLAY_DURATION;
      }
    }
    stopTowerDrag();
  });

  requestAnimationFrame(loop);
};

void startApp();
