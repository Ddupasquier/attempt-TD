import { DEFENSE_IDS } from "../constants/defenseIds";
import type { SpellScrollSound } from "../types/core/types";
import type { ToneConfig } from "../types/core/audioTypes";

const DEFENSE_TONE_PRESETS: Record<string, Omit<ToneConfig, "duration">> = {
  [DEFENSE_IDS.wizard]: { freq: 520, type: "triangle", gain: 0.06 },
  [DEFENSE_IDS.ranger]: { freq: 740, type: "square", gain: 0.05 },
  [DEFENSE_IDS.fighter]: { freq: 360, type: "square", gain: 0.07 },
};

const DEFAULT_DEFENSE_TONE: Omit<ToneConfig, "duration"> = {
  freq: 460,
  type: "triangle",
  gain: 0.05,
};

const getDefenseTonePreset = (defenseTypeId: string) =>
  DEFENSE_TONE_PRESETS[defenseTypeId] ?? DEFAULT_DEFENSE_TONE;

const SPELL_SCROLL_SOUND_EFFECTS: SpellScrollSound[] = ["shock", "boom", "nuke", "glue"];

const isSpellScrollSoundEffect = (effect: string): effect is SpellScrollSound =>
  SPELL_SCROLL_SOUND_EFFECTS.includes(effect as SpellScrollSound);

export {
  DEFENSE_TONE_PRESETS,
  DEFAULT_DEFENSE_TONE,
  SPELL_SCROLL_SOUND_EFFECTS,
  getDefenseTonePreset,
  isSpellScrollSoundEffect,
};
