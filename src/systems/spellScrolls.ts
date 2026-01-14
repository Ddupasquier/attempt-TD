import type { GameState, SpellScroll, SpellScrollSound } from "../types/core/types";
import { applyDamageModifiers } from "../core/combat";
import { tileCenter } from "../core/geometry";
import { GAME_CONFIG } from "../core/config";

const applySlow = (foe: GameState["foes"][number], multiplier: number, duration: number) => {
  foe.slowRemaining = Math.max(foe.slowRemaining ?? 0, duration);
  foe.slowMultiplier = Math.min(foe.slowMultiplier ?? 1, multiplier);
};

const applyKnockback = (foe: GameState["foes"][number], distance: number) => {
  if ((foe.knockbackResistRemaining ?? 0) > 0) return;
  const typeScale =
    foe.isBoss || foe.type === "boss"
      ? GAME_CONFIG.foe.bossKnockbackDistanceMultiplier
      : GAME_CONFIG.foe.types[foe.type].knockbackDistanceMultiplier;
  const resistance = foe.isBoss || foe.type === "elite" ? 0.5 : 1;
  const knockbackDistance = distance * 2.6 * resistance * typeScale;
  foe.knockbackRemaining = Math.max(foe.knockbackRemaining ?? 0, knockbackDistance);
  foe.knockbackX = 0;
  foe.knockbackY = 0;
  foe.knockbackResistRemaining =
    foe.isBoss || foe.type === "boss"
      ? GAME_CONFIG.foe.bossKnockbackResistSeconds
      : GAME_CONFIG.foe.types[foe.type].knockbackResistSeconds;
};

const updateSpellScrolls = (
  state: GameState,
  dt: number,
  size: number,
  cols: number,
  rows: number,
  onStateChange: () => void,
  playSpellScrollSound: (soundEffect: SpellScrollSound | undefined) => void,
) => {
  void dt;
  const scrollByKey = new Map<string, SpellScroll>();
  let didChange = false;

  for (let i = state.spellScrolls.length - 1; i >= 0; i -= 1) {
    const scroll = state.spellScrolls[i];
    if (scroll.triggersRemaining === 0) {
      state.spellScrolls.splice(i, 1);
      didChange = true;
      continue;
    }
    scrollByKey.set(`${scroll.col},${scroll.row}`, scroll);
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

  for (const foe of state.foes) {
    if (foe.x === undefined || foe.y === undefined) continue;
    const col = Math.floor(foe.x / size);
    const row = Math.floor(foe.y / size);
    const key = `${col},${row}`;
    if (foe.lastSpellScrollTile === key) continue;
    foe.lastSpellScrollTile = key;

    const scroll = scrollByKey.get(key);
    if (!scroll) continue;

    playSpellScrollSound(scroll.type.soundEffect);
    if (scroll.type.killsAll) {
      for (const target of state.foes) {
        target.hp = 0;
        if (scroll.type.knockbackDistanceTiles) {
          applyKnockback(target, scroll.type.knockbackDistanceTiles * size);
        }
      }
      const radius = Math.hypot(cols, rows) * size;
      const center = tileCenter(scroll.col, scroll.row, size);
      state.effects.push({
        x: center.x,
        y: center.y,
        radius,
        time: 0,
        duration: 0.5,
      });
    } else if (scroll.type.damage) {
      if (scroll.type.splashRadiusTiles) {
        const center = tileCenter(scroll.col, scroll.row, size);
        const radius = scroll.type.splashRadiusTiles * size;
        for (const target of state.foes) {
          if (target.x === undefined || target.y === undefined) continue;
          const dx = target.x - center.x;
          const dy = target.y - center.y;
          const dist = Math.hypot(dx, dy);
          if (dist > radius) continue;
          const damage = applyDamageModifiers(
            scroll.type.damage,
            scroll.type.damageType,
            target.damageResistances,
            target.damageGroupResistances,
          );
          target.hp -= damage;
          pushDamagePopup(target.x, target.y, Math.round(damage));
          if (scroll.type.knockbackDistanceTiles) {
            applyKnockback(target, scroll.type.knockbackDistanceTiles * size);
          }
          if (scroll.type.slowMultiplier && scroll.type.slowDuration) {
            applySlow(target, scroll.type.slowMultiplier, scroll.type.slowDuration);
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
          scroll.type.damage,
          scroll.type.damageType,
          foe.damageResistances,
          foe.damageGroupResistances,
        );
        foe.hp -= damage;
        pushDamagePopup(foe.x, foe.y, Math.round(damage));
        if (scroll.type.knockbackDistanceTiles) {
          applyKnockback(foe, scroll.type.knockbackDistanceTiles * size);
        }
        if (scroll.type.slowMultiplier && scroll.type.slowDuration) {
          applySlow(foe, scroll.type.slowMultiplier, scroll.type.slowDuration);
        }
      }
    } else if (scroll.type.slowMultiplier && scroll.type.slowDuration) {
      applySlow(foe, scroll.type.slowMultiplier, scroll.type.slowDuration);
    }

    if (scroll.triggersRemaining !== undefined) {
      scroll.triggersRemaining = Math.max(0, scroll.triggersRemaining - 1);
      if (scroll.triggersRemaining === 0) {
        didChange = true;
      }
    }

    didChange = true;
  }

  if (didChange) {
    onStateChange();
  }
};

export { updateSpellScrolls };
