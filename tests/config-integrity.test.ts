import { describe, expect, it } from "vitest";
import {
  DEFENSE_CONFIG,
  FACTION_PROGRESSION,
  FOE_FACTION_DEFINITIONS,
  GAME_CONFIG,
  SPELL_SCROLL_CONFIG,
} from "../src/core/config";
import { defenseSprites } from "../src/core/sprites/defenses";
import { spellScrollSprites } from "../src/core/sprites/spellScrolls";

describe("defense config integrity", () => {
  // Guard against missing level stats/costs breaking upgrades.
  it("has upgrade data for every defense level", () => {
    expect(DEFENSE_CONFIG.levelStats.length).toBe(DEFENSE_CONFIG.maxLevel + 1);
    const costLevels = new Set(DEFENSE_CONFIG.levelCosts.map((entry) => entry.level));
    for (let level = 1; level <= DEFENSE_CONFIG.maxLevel; level += 1) {
      expect(costLevels.has(level)).toBe(true);
    }
  });

  // Validate core defense fields so UI and combat stats don't blow up.
  it("keeps defense type ids unique and valid", () => {
    const ids = DEFENSE_CONFIG.types.map((defense) => defense.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const defense of DEFENSE_CONFIG.types) {
      expect(defense.name.trim().length).toBeGreaterThan(0);
      expect(defense.types.length).toBeGreaterThan(0);
      expect(defense.description.trim().length).toBeGreaterThan(0);
      expect(defense.cost).toBeGreaterThan(0);
      expect(defense.range).toBeGreaterThanOrEqual(DEFENSE_CONFIG.minRange);
      expect(defense.rate).toBeGreaterThan(0);
      expect(defense.damage).toBeGreaterThanOrEqual(0);
      expect(defense.critChance).toBeGreaterThanOrEqual(0);
      expect(defense.critChance).toBeLessThanOrEqual(1);
      expect(defense.critMultiplier).toBeGreaterThanOrEqual(1);
    }
  });

  // Ensure every defense has a sprite mapping for rendering.
  it("has sprites for every defense type", () => {
    for (const defense of DEFENSE_CONFIG.types) {
      expect(defenseSprites[defense.id]).toBeTruthy();
    }
  });
});

describe("spell scroll config integrity", () => {
  // Validate scroll metadata to prevent UI/tooling regressions.
  it("keeps spell scroll type ids unique and consistent", () => {
    const ids = SPELL_SCROLL_CONFIG.types.map((scroll) => scroll.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const scroll of SPELL_SCROLL_CONFIG.types) {
      expect(scroll.name.trim().length).toBeGreaterThan(0);
      expect(scroll.types.length).toBeGreaterThan(0);
      expect(scroll.description.trim().length).toBeGreaterThan(0);
      expect(scroll.cost).toBeGreaterThan(0);
      if (scroll.damage !== undefined) {
        expect(scroll.damageType).toBeDefined();
      }
      if (scroll.slowMultiplier !== undefined) {
        expect(scroll.slowDuration).toBeDefined();
      }
      if (scroll.cooldownPerWave) {
        expect(scroll.cooldownSeconds).toBeDefined();
      }
      if (scroll.maxTriggers !== undefined) {
        expect(scroll.maxTriggers).toBeGreaterThan(0);
      }
    }
  });

  // Ensure each scroll has a sprite mapping for rendering.
  it("has sprites for every spell scroll type", () => {
    for (const scroll of SPELL_SCROLL_CONFIG.types) {
      expect(spellScrollSprites[scroll.id]).toBeTruthy();
    }
  });
});

describe("foe config integrity", () => {
  // Every faction in progression must exist and be configured.
  it("covers every faction in progression", () => {
    const progressionIds = FACTION_PROGRESSION.map((faction) => faction.id);
    expect(new Set(progressionIds).size).toBe(progressionIds.length);
    for (const factionId of progressionIds) {
      expect(FOE_FACTION_DEFINITIONS[factionId]).toBeTruthy();
      expect(GAME_CONFIG.foe.factionResistances?.[factionId]).toBeDefined();
    }
  });

  // Prevent gaps/overlaps in the wave-to-faction mapping.
  it("keeps faction progression contiguous", () => {
    expect(FACTION_PROGRESSION[0]?.start).toBe(1);
    for (let i = 1; i < FACTION_PROGRESSION.length; i += 1) {
      const previous = FACTION_PROGRESSION[i - 1];
      const current = FACTION_PROGRESSION[i];
      expect(current.start).toBe(previous.end + 1);
      expect(current.end).toBeGreaterThanOrEqual(current.start);
    }
  });

  // Each faction must expose the full five-foe roster.
  it("defines five foe types per faction", () => {
    const requiredTypes = new Set(["swarm", "grunt", "tank", "elite", "boss"]);
    for (const faction of Object.values(FOE_FACTION_DEFINITIONS)) {
      expect(faction.enemies.length).toBe(5);
      const foeTypes = new Set(faction.enemies.map((enemy) => enemy.foeType));
      expect(foeTypes).toEqual(requiredTypes);
    }
  });
});
