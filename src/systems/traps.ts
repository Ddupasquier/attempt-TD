import type { GameState, Trap } from "../types/core/types";
import { applyDamageModifiers } from "../core/combat";
import { tileCenter } from "../core/geometry";

const applySlow = (enemy: GameState["enemies"][number], multiplier: number, duration: number) => {
  enemy.slowRemaining = Math.max(enemy.slowRemaining ?? 0, duration);
  enemy.slowMultiplier = Math.min(enemy.slowMultiplier ?? 1, multiplier);
};

const updateTraps = (
  state: GameState,
  dt: number,
  size: number,
  cols: number,
  rows: number,
  onStateChange: () => void,
  playTrapSound: (trapId: string) => void,
) => {
  const trapByKey = new Map<string, Trap>();
  let didChange = false;

  for (let i = state.traps.length - 1; i >= 0; i -= 1) {
    const trap = state.traps[i];
    if (trap.triggersRemaining === 0) {
      state.traps.splice(i, 1);
      didChange = true;
      continue;
    }
    trapByKey.set(`${trap.col},${trap.row}`, trap);
  }

  const pushDamagePopup = (x: number, y: number, value: number) => {
    if (!state.showDamagePopups || value <= 0) return;
    state.damagePopups.push({
      x,
      y,
      value,
      color: "#1b1b1b",
      time: 0,
      duration: 0.6,
      sizeMult: 1,
    });
  };

  for (const enemy of state.enemies) {
    if (enemy.x === undefined || enemy.y === undefined) continue;
    const col = Math.floor(enemy.x / size);
    const row = Math.floor(enemy.y / size);
    const key = `${col},${row}`;
    if (enemy.lastTrapTile === key) continue;
    enemy.lastTrapTile = key;

    const trap = trapByKey.get(key);
    if (!trap) continue;

    playTrapSound(trap.type.id);
    if (trap.type.killsAll) {
      for (const target of state.enemies) {
        target.hp = 0;
      }
      const radius = Math.hypot(cols, rows) * size;
      const center = tileCenter(trap.col, trap.row, size);
      state.effects.push({
        x: center.x,
        y: center.y,
        radius,
        time: 0,
        duration: 0.5,
      });
    } else if (trap.type.damage) {
      if (trap.type.splashRadiusTiles) {
        const center = tileCenter(trap.col, trap.row, size);
        const radius = trap.type.splashRadiusTiles * size;
        for (const target of state.enemies) {
          if (target.x === undefined || target.y === undefined) continue;
          const dx = target.x - center.x;
          const dy = target.y - center.y;
          const dist = Math.hypot(dx, dy);
          if (dist > radius) continue;
          const damage = applyDamageModifiers(
            trap.type.damage,
            trap.type.damageType,
            target.damageResistances,
            target.damageGroupResistances,
          );
          target.hp -= damage;
          pushDamagePopup(target.x, target.y, Math.round(damage));
          if (trap.type.slowMultiplier && trap.type.slowDuration) {
            applySlow(target, trap.type.slowMultiplier, trap.type.slowDuration);
          }
        }
        state.effects.push({
          x: center.x,
          y: center.y,
          radius,
          time: 0,
          duration: 0.35,
        });
      } else {
        const damage = applyDamageModifiers(
          trap.type.damage,
          trap.type.damageType,
          enemy.damageResistances,
          enemy.damageGroupResistances,
        );
        enemy.hp -= damage;
        pushDamagePopup(enemy.x, enemy.y, Math.round(damage));
        if (trap.type.slowMultiplier && trap.type.slowDuration) {
          applySlow(enemy, trap.type.slowMultiplier, trap.type.slowDuration);
        }
      }
    } else if (trap.type.slowMultiplier && trap.type.slowDuration) {
      applySlow(enemy, trap.type.slowMultiplier, trap.type.slowDuration);
    }

    if (trap.triggersRemaining !== undefined) {
      trap.triggersRemaining = Math.max(0, trap.triggersRemaining - 1);
      if (trap.triggersRemaining === 0) {
        didChange = true;
      }
    }

    didChange = true;
  }

  if (didChange) {
    onStateChange();
  }
};

export { updateTraps };
