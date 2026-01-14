import type { GameState, SaveData } from "../types/core/types";

const STORAGE_KEY = "fantasy-td-save";

const saveGame = (state: GameState) => {
  const data: SaveData = {
    gold: state.gold,
    hp: state.hp,
    wave: state.wave,
    isCountingDown: state.isCountingDown,
    countdownRemaining: state.countdownRemaining,
    soundEnabled: state.soundEnabled,
    autoWaveEnabled: state.autoWaveEnabled,
    showDamagePopups: state.showDamagePopups,
    selectedDefenseId: state.selectedDefense ? state.selectedDefense.id : null,
    spellScrollCooldowns: Object.fromEntries(
      Object.entries(state.spellScrollCooldowns).map(([scrollId, remaining]) => [
        scrollId,
        Number.isFinite(remaining) ? remaining : -1,
      ]),
    ),
    waves: state.waves.map((wave) => ({
      id: wave.id,
      waveNumber: wave.waveNumber,
      spawnTimer: wave.spawnTimer,
      spawnIndex: wave.spawnIndex,
      totalSpawns: wave.totalSpawns,
      remainingFoes: wave.remainingFoes,
      bossSpawned: wave.bossSpawned,
      hpLost: wave.hpLost,
    })),
    foes: state.foes.map((foe) => ({
      id: foe.id,
      hp: foe.hp,
      maxHp: foe.maxHp,
      speed: foe.speed,
      waveId: foe.waveId,
      faction: foe.faction,
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
    })),
    spellScrolls: state.spellScrolls.map((scroll) => ({
      col: scroll.col,
      row: scroll.row,
      typeId: scroll.type.id,
      triggersRemaining: scroll.triggersRemaining,
    })),
    defenses: state.defenses.map((defense) => ({
      col: defense.col,
      row: defense.row,
      typeId: defense.type.id,
      level: defense.level,
      cooldown: defense.cooldown,
      targetCol: defense.targetCol,
      targetRow: defense.targetRow,
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
