import { describe, expect, it } from "vitest";
import { GAME_CONFIG } from "../src/core/config";
import { SPELL_SCROLL_IDS } from "../src/constants/spellScrollIds";
import { getDefenseTonePreset, isSpellScrollSoundEffect } from "../src/core/audioConfig";

describe("audio config", () => {
  it("gives every defense a valid tone preset", () => {
    const failures: string[] = [];
    for (const defense of GAME_CONFIG.defenseTypes) {
      const preset = getDefenseTonePreset(defense.id);
      if (!preset) {
        failures.push(defense.id);
        continue;
      }
      if (!Number.isFinite(preset.freq) || preset.freq <= 0) failures.push(defense.id);
      if (!preset.type) failures.push(defense.id);
      if (!Number.isFinite(preset.gain) || preset.gain <= 0) failures.push(defense.id);
    }
    expect(failures).toEqual([]);
  });

  it("only assigns sound effects to supported spell scrolls", () => {
    const requiredScrollSoundIds = new Set<string>([
      SPELL_SCROLL_IDS.shock,
      SPELL_SCROLL_IDS.bomb,
      SPELL_SCROLL_IDS.nuke,
      SPELL_SCROLL_IDS.glue,
    ]);
    const missing: string[] = [];
    const unexpected: string[] = [];
    const invalid: string[] = [];

    for (const scroll of GAME_CONFIG.spellScrollTypes) {
      if (requiredScrollSoundIds.has(scroll.id) && !scroll.soundEffect) {
        missing.push(scroll.id);
      }
      if (scroll.soundEffect && !isSpellScrollSoundEffect(scroll.soundEffect)) {
        invalid.push(scroll.id);
      }
      if (!requiredScrollSoundIds.has(scroll.id) && scroll.soundEffect) {
        unexpected.push(scroll.id);
      }
    }

    expect(missing).toEqual([]);
    expect(invalid).toEqual([]);
    expect(unexpected).toEqual([]);
  });
});
