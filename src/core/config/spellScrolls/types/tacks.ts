import type { SpellScrollType } from "../../../../types/core/types";
import { SPELL_SCROLL_IDS } from "../../../../constants/spellScrollIds";

const tacksSpellScroll: SpellScrollType = {
      id: SPELL_SCROLL_IDS.tacks,
      name: "Caltrop Sigil",
      types: ["Martial", "Trap"],
      cost: 45,
      maxTriggers: 4,
      cooldownSeconds: 12,
      damage: 7,
      damageType: "piercing",
      description: "Hidden spikes shred rushing feet.",
    };

export { tacksSpellScroll };
