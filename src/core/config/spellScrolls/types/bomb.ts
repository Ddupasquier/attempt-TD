import type { SpellScrollType } from "../../../../types/core/types";
import { SPELL_SCROLL_IDS } from "../../../../constants/spellScrollIds";

const bombSpellScroll: SpellScrollType = {
      id: SPELL_SCROLL_IDS.bomb,
      name: "Fireball Sigil",
      types: ["Arcane", "Trap"],
      cost: 120,
      maxTriggers: 1,
      cooldownSeconds: 25,
      damage: 45,
      damageType: "fire",
      knockbackDistanceTiles: 1.2,
      splashRadiusTiles: 1.5,
      soundEffect: "boom",
      description: "A rune that erupts in fiery blast.",
    };

export { bombSpellScroll };
