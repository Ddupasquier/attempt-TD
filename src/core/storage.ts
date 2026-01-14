import type { GameState, SaveData } from "../types/core/types";

const STORAGE_KEY = "fantasy-td-save";

const saveGame = (state: GameState) => {
  const data: SaveData = {
    gold: state.gold,
    lives: state.lives,
    wave: state.wave,
    isCountingDown: state.isCountingDown,
    countdownRemaining: state.countdownRemaining,
    soundEnabled: state.soundEnabled,
    autoWaveEnabled: state.autoWaveEnabled,
    showDamagePopups: state.showDamagePopups,
    selectedTowerId: state.selectedTower ? state.selectedTower.id : null,
    trapCooldowns: Object.fromEntries(
      Object.entries(state.trapCooldowns).map(([trapId, remaining]) => [
        trapId,
        Number.isFinite(remaining) ? remaining : -1,
      ]),
    ),
    waves: state.waves.map((wave) => ({
      id: wave.id,
      waveNumber: wave.waveNumber,
      spawnTimer: wave.spawnTimer,
      spawnIndex: wave.spawnIndex,
      totalSpawns: wave.totalSpawns,
      remainingEnemies: wave.remainingEnemies,
      bossSpawned: wave.bossSpawned,
      livesLost: wave.livesLost,
    })),
    enemies: state.enemies.map((enemy) => ({
      id: enemy.id,
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      speed: enemy.speed,
      waveId: enemy.waveId,
      faction: enemy.faction,
      type: enemy.type,
      targetIndex: enemy.targetIndex,
      isBoss: enemy.isBoss,
      sizeScale: enemy.sizeScale,
      x: enemy.x,
      y: enemy.y,
      vx: enemy.vx,
      vy: enemy.vy,
      knockbackRemaining: enemy.knockbackRemaining,
      knockbackResistRemaining: enemy.knockbackResistRemaining,
      slowRemaining: enemy.slowRemaining,
      slowMultiplier: enemy.slowMultiplier,
      lastTrapTile: enemy.lastTrapTile,
    })),
    traps: state.traps.map((trap) => ({
      col: trap.col,
      row: trap.row,
      typeId: trap.type.id,
      triggersRemaining: trap.triggersRemaining,
    })),
    towers: state.towers.map((tower) => ({
      col: tower.col,
      row: tower.row,
      typeId: tower.type.id,
      level: tower.level,
      cooldown: tower.cooldown,
      targetCol: tower.targetCol,
      targetRow: tower.targetRow,
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadGame = (): SaveData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveData;
  } catch (error) {
    console.warn("Failed to load save", error);
    return null;
  }
};

export { loadGame, saveGame };
