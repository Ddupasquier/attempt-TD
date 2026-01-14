import type { SpellScrollType } from "../../../../types/core/types";
import { SPELL_SCROLL_IDS } from "../../../../constants/spellScrollIds";

const glueSpellScroll: SpellScrollType = {
      id: SPELL_SCROLL_IDS.glue,
      name: "Snaring Sigil",
      types: ["Primal", "Trap"],
      cost: 60,
      maxTriggers: 3,
      cooldownSeconds: 18,
      slowMultiplier: 0.55,
      slowDuration: 2,
      soundEffect: "glue",
      description: "Sticky runes slow enemies in place.",
    };

export { glueSpellScroll };
