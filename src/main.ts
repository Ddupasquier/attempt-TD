import "./style.scss";
import { createAudioSystem } from "./core/audio";
import { assertTowerRanges, enemySprites, getFactionForWave, grid, pathPoints, towerSprites, towerTypes } from "./core/data";
import { requireElement, getCanvasContext } from "./core/dom";
import { getTileSize, screenToGrid } from "./core/geometry";
import { buildPathTiles } from "./core/path";
import { createInitialState } from "./core/state";
import { loadGame, saveGame } from "./core/storage";
import { BOW_TREE_RANGE_BONUS, isTreeTile } from "./core/terrain";
import type { GameState, TowerType } from "./core/types";
import { drawFrame } from "./render/draw";
import { spawnEnemy, updateEnemies } from "./systems/enemies";
import { updateProjectiles } from "./systems/projectiles";
import { updateTowers } from "./systems/towers";
import { startNewWave, updateCountdown, updateWaves } from "./systems/waves";
import {
  buildTowerList,
  hideDefeatModal,
  setSelectedTowerCard,
  showDefeatModal,
  updateFactionLabel,
  updateSoundButton,
  updateStats,
  updateWaveButton,
} from "./ui/hud";

const canvas = requireElement<HTMLCanvasElement>("game");
const ctx = getCanvasContext(canvas);

const statsEl = requireElement<HTMLDivElement>("stats");
const towerListEl = requireElement<HTMLDivElement>("towerList");
const startWaveBtn = requireElement<HTMLButtonElement>("startWave");
const resetBtn = requireElement<HTMLButtonElement>("resetGame");
const toggleSoundBtn = requireElement<HTMLButtonElement>("toggleSound");
const defeatModal = requireElement<HTMLDivElement>("defeatModal");
const defeatReset = requireElement<HTMLButtonElement>("defeatReset");
const factionLabel = requireElement<HTMLDivElement>("factionLabel");

const pathTiles = buildPathTiles(pathPoints);
const audio = createAudioSystem();

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
let isDragging = false;

const RANGE_DISPLAY_DURATION = 2.5;

const markStateDirty = () => {
  if (!isLoading) {
    isStateDirty = true;
  }
};

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

assertTowerRanges();

const canPlaceTower = (col: number, row: number) => {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return false;
  if (pathTiles.has(`${col},${row}`)) return false;
  return !gameState.towers.some((tower) => tower.col === col && tower.row === row);
};

const addTower = (col: number, row: number, type: TowerType, rangeBonus: number) => {
  const tower = {
    id: crypto.randomUUID(),
    col,
    row,
    type,
    cooldown: 0,
    rangeBonus,
  };
  gameState.towers.push(tower);
  markStateDirty();
  return tower;
};

const setSelectedTower = (id: string) => {
  gameState.selectedTower = towerTypes.find((tower) => tower.id === id) || null;
  if (gameState.selectedTower) {
    setSelectedTowerCard(towerListEl, id);
  }
  markStateDirty();
};

const startTowerDrag = (towerTypeId: string) => {
  dragTowerTypeId = towerTypeId;
  isDragging = true;
  setSelectedTower(towerTypeId);
};

const updateDragPointer = (event: PointerEvent) => {
  if (!isDragging) return;
  dragPointer = { x: event.clientX, y: event.clientY };
};

const stopTowerDrag = () => {
  dragTowerTypeId = null;
  dragPointer = null;
  isDragging = false;
};

const updateUI = () => {
  updateStats(statsEl, gameState);
  updateSoundButton(toggleSoundBtn, gameState.soundEnabled);
  updateWaveButton(startWaveBtn, gameState.isCountingDown, gameState.countdownRemaining);
  updateFactionLabel(factionLabel, getFactionForWave(gameState.wave).name);
};

const resetGame = () => {
  gameState = createInitialState();
  isDefeated = false;
  selectedTowerId = null;
  recentTowerId = null;
  recentRemainingSeconds = 0;
  hideDefeatModal(defeatModal);
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
  updateWaveButton(startWaveBtn, gameState.isCountingDown, gameState.countdownRemaining);
};

const handlePointer = (event: PointerEvent) => {
  const rect = canvas.getBoundingClientRect();
  const size = getTileSize(canvas, grid);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { col, row } = screenToGrid(x, y, size);
  const towerAtTile = gameState.towers.find((tower) => tower.col === col && tower.row === row);
  if (towerAtTile) {
    selectedTowerId = towerAtTile.id;
    return;
  }
  selectedTowerId = null;
  if (!gameState.selectedTower) return;
  if (isDragging) return;
  if (!canPlaceTower(col, row)) return;
  if (gameState.gold < gameState.selectedTower.cost) return;
  const rangeBonus =
    gameState.selectedTower.types.includes("Bow") && isTreeTile(col, row, pathTiles) ? BOW_TREE_RANGE_BONUS : 0;
  const placedTower = addTower(col, row, gameState.selectedTower, rangeBonus);
  gameState.gold -= gameState.selectedTower.cost;
  recentTowerId = placedTower.id;
  recentRemainingSeconds = RANGE_DISPLAY_DURATION;
  markStateDirty();
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
  gameState.wave = data.wave ?? gameState.wave;
  gameState.soundEnabled = data.soundEnabled ?? gameState.soundEnabled;
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
            rangeBonus: type.types.includes("Bow") && isTreeTile(tower.col, tower.row, pathTiles) ? BOW_TREE_RANGE_BONUS : 0,
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
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0;
  lastTime = timestamp;
  const size = getTileSize(canvas, grid);
  let highlightAlpha = 0;
  let highlightTowerId: string | null = null;
  if (selectedTowerId) {
    highlightTowerId = selectedTowerId;
    highlightAlpha = 1;
  } else if (recentTowerId) {
    recentRemainingSeconds = Math.max(recentRemainingSeconds - dt, 0);
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
          return {
            x: localX,
            y: localY,
            range: tower.range,
            color: tower.color,
            sprite: towerSprites[tower.id],
          };
        })()
      : null;

  if (gameState.lives <= 0) {
    if (!isDefeated) {
      isDefeated = true;
      showDefeatModal(defeatModal);
      markStateDirty();
    }
    drawFrame(
      ctx,
      size,
      pathTiles,
      gameState.towers,
      gameState.enemies,
      gameState.projectiles,
      towerSprites,
      enemySprites,
      grid.cols,
      grid.rows,
      highlightTowerId,
      highlightAlpha,
      dragPreview ?? undefined,
    );
    updateUI();
    if (isStateDirty) {
      saveGame(gameState);
      isStateDirty = false;
    }
    requestAnimationFrame(loop);
    return;
  }

  updateCountdown(gameState, dt);
  updateWaves(gameState, dt, (wave) => spawnEnemy(gameState, wave), markStateDirty);
  updateEnemies(gameState, dt, size, markStateDirty);
  updateTowers(gameState, dt, size);
  updateProjectiles(gameState, dt, (towerTypeId) => audio.playDamageSound(towerTypeId, gameState.soundEnabled));

  drawFrame(
    ctx,
    size,
    pathTiles,
    gameState.towers,
    gameState.enemies,
    gameState.projectiles,
    towerSprites,
    enemySprites,
    grid.cols,
    grid.rows,
    highlightTowerId,
    highlightAlpha,
    dragPreview ?? undefined,
  );

  updateUI();

  if (isStateDirty) {
    saveGame(gameState);
    isStateDirty = false;
  }

  requestAnimationFrame(loop);
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

buildTowerList(towerListEl, towerTypes, towerSprites, setSelectedTower, startTowerDrag);

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
      const rangeBonus = tower.types.includes("Bow") && isTreeTile(col, row, pathTiles) ? BOW_TREE_RANGE_BONUS : 0;
      const placedTower = addTower(col, row, tower, rangeBonus);
      gameState.gold -= tower.cost;
      recentTowerId = placedTower.id;
      recentRemainingSeconds = RANGE_DISPLAY_DURATION;
    }
  }
  stopTowerDrag();
});

startWaveBtn.addEventListener("click", () => {
  audio.unlock();
  startWave();
});

resetBtn.addEventListener("click", () => {
  audio.unlock();
  resetGame();
});

toggleSoundBtn.addEventListener("click", () => {
  audio.unlock();
  gameState.soundEnabled = !gameState.soundEnabled;
  updateSoundButton(toggleSoundBtn, gameState.soundEnabled);
  markStateDirty();
});

defeatReset.addEventListener("click", () => {
  resetGame();
});

requestAnimationFrame(loop);
