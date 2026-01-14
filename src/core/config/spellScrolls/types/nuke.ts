import type { SpellScrollType } from "../../../../types/core/types";
import { SPELL_SCROLL_IDS } from "../../../../constants/spellScrollIds";

const nukeSpellScroll: SpellScrollType = {
      id: SPELL_SCROLL_IDS.nuke,
      name: "Apocalyptic Sigil",
      types: ["Arcane", "Trap"],
      cost: 1000,
      maxTriggers: 1,
      cooldownSeconds: 45,
      cooldownPerWave: true,
      damage: 9999,
      damageType: "fire",
      knockbackDistanceTiles: 2.2,
      killsAll: true,
      soundEffect: "nuke",
      description: "Calls down cataclysmic fire from the skies.",
    };

export { nukeSpellScroll };
