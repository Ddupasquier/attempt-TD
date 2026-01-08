import "./style.scss";
import { createAudioSystem } from "./core/audio";
import { getFactionForWave, grid, pathPoints, towerTypes, enemySprites, towerSprites } from "./core/data";
import { requireElement, getCanvasContext } from "./core/dom";
import { getTileSize, screenToGrid } from "./core/geometry";
import { buildPathTiles } from "./core/path";
import { createInitialState } from "./core/state";
import { loadGame, saveGame } from "./core/storage";
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

let state: GameState = createInitialState();
let lastTime = 0;
let isDefeated = false;
let isLoading = false;
let stateDirty = false;

function markDirty() {
  if (!isLoading) {
    stateDirty = true;
  }
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function canPlaceTower(col: number, row: number) {
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return false;
  if (pathTiles.has(`${col},${row}`)) return false;
  return !state.towers.some((tower) => tower.col === col && tower.row === row);
}

function addTower(col: number, row: number, type: TowerType) {
  state.towers.push({
    id: crypto.randomUUID(),
    col,
    row,
    type,
    cooldown: 0,
  });
  markDirty();
}

function setSelectedTower(id: string) {
  state.selectedTower = towerTypes.find((tower) => tower.id === id) || null;
  if (state.selectedTower) {
    setSelectedTowerCard(towerListEl, id);
  }
  markDirty();
}

function updateUI() {
  updateStats(statsEl, state);
  updateSoundButton(toggleSoundBtn, state.soundEnabled);
  updateWaveButton(startWaveBtn, state.isCountingDown, state.countdownRemaining);
  updateFactionLabel(factionLabel, getFactionForWave(state.wave).name);
}

function resetGame() {
  state = createInitialState();
  isDefeated = false;
  hideDefeatModal(defeatModal);
  setSelectedTower(towerTypes[0].id);
  markDirty();
  updateUI();
}

function startWave() {
  if (state.isCountingDown || isDefeated) return;
  startNewWave(state);
  state.isCountingDown = true;
  state.countdownRemaining = 5;
  markDirty();
  updateWaveButton(startWaveBtn, state.isCountingDown, state.countdownRemaining);
}

function handlePointer(event: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  const size = getTileSize(canvas, grid);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { col, row } = screenToGrid(x, y, size);
  if (!state.selectedTower) return;
  if (!canPlaceTower(col, row)) return;
  if (state.gold < state.selectedTower.cost) return;
  addTower(col, row, state.selectedTower);
  state.gold -= state.selectedTower.cost;
  markDirty();
}

function loadSavedGame() {
  const data = loadGame();
  if (!data) {
    setSelectedTower(towerTypes[0].id);
    updateUI();
    return;
  }
  state.gold = data.gold ?? state.gold;
  state.lives = data.lives ?? state.lives;
  state.wave = data.wave ?? state.wave;
  state.soundEnabled = data.soundEnabled ?? state.soundEnabled;
  state.towers = Array.isArray(data.towers)
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
          };
        })
        .filter((tower): tower is NonNullable<typeof tower> => Boolean(tower))
    : [];

  const preferredId = data.selectedTowerId ?? towerTypes[0].id;
  const selectedId = towerTypes.some((tower) => tower.id === preferredId) ? preferredId : towerTypes[0].id;
  setSelectedTower(selectedId);
  updateUI();
}

function loop(timestamp: number) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0;
  lastTime = timestamp;
  const size = getTileSize(canvas, grid);

  if (state.lives <= 0) {
    if (!isDefeated) {
      isDefeated = true;
      showDefeatModal(defeatModal);
      markDirty();
    }
    drawFrame(
      ctx,
      size,
      pathTiles,
      state.towers,
      state.enemies,
      state.projectiles,
      towerSprites,
      enemySprites,
      grid.cols,
      grid.rows,
    );
    updateUI();
    if (stateDirty) {
      saveGame(state);
      stateDirty = false;
    }
    requestAnimationFrame(loop);
    return;
  }

  updateCountdown(state, dt);
  updateWaves(state, dt, (wave) => spawnEnemy(state, wave), markDirty);
  updateEnemies(state, dt, size, markDirty);
  updateTowers(state, dt, size);
  updateProjectiles(state, dt, (towerTypeId) => audio.playDamageSound(towerTypeId, state.soundEnabled));

  drawFrame(
    ctx,
    size,
    pathTiles,
    state.towers,
    state.enemies,
    state.projectiles,
    towerSprites,
    enemySprites,
    grid.cols,
    grid.rows,
  );

  updateUI();

  if (stateDirty) {
    saveGame(state);
    stateDirty = false;
  }

  requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

buildTowerList(towerListEl, towerTypes, setSelectedTower);

isLoading = true;
loadSavedGame();
isLoading = false;
updateUI();

canvas.addEventListener("pointerdown", (event) => {
  audio.unlock();
  canvas.setPointerCapture(event.pointerId);
  handlePointer(event);
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
  state.soundEnabled = !state.soundEnabled;
  updateSoundButton(toggleSoundBtn, state.soundEnabled);
  markDirty();
});

defeatReset.addEventListener("click", () => {
  resetGame();
});

requestAnimationFrame(loop);
