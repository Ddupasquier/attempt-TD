import type { SpellScrollType } from "../../../../types/core/types";
import { SPELL_SCROLL_IDS } from "../../../../constants/spellScrollIds";

const shockSpellScroll: SpellScrollType = {
      id: SPELL_SCROLL_IDS.shock,
      name: "Storm Sigil",
      types: ["Arcane", "Trap"],
      cost: 140,
      maxTriggers: 2,
      cooldownSeconds: 22,
      damage: 20,
      damageType: "lightning",
      knockbackDistanceTiles: 0.5,
      soundEffect: "shock",
      description: "Arc lightning rattles armored foes.",
    };

export { shockSpellScroll };
