import type { SpellScrollType } from "../../../types/core/types";
import { tacksSpellScroll } from "./types/tacks";
import { glueSpellScroll } from "./types/glue";
import { shockSpellScroll } from "./types/shock";
import { nukeSpellScroll } from "./types/nuke";
import { bombSpellScroll } from "./types/bomb";

const SPELL_SCROLL_CONFIG = {
  types: [
    tacksSpellScroll,
    glueSpellScroll,
    shockSpellScroll,
    nukeSpellScroll,
    bombSpellScroll,
  ],
} satisfies {
  types: SpellScrollType[];
};

export { SPELL_SCROLL_CONFIG };
