import { SPELL_SCROLL_IDS } from "../../constants/spellScrollIds";
import type { PixelSprite } from "../../types/core/types";
import { tacksSprite } from "./spellScrolls/tacks";
import { spikeSprite } from "./spellScrolls/spike";
import { glueSprite } from "./spellScrolls/glue";
import { shockSprite } from "./spellScrolls/shock";
import { bombSprite } from "./spellScrolls/bomb";
import { nukeSprite } from "./spellScrolls/nuke";

const spellScrollSprites: Record<string, PixelSprite> = {
  [SPELL_SCROLL_IDS.tacks]: tacksSprite,
  [SPELL_SCROLL_IDS.spike]: spikeSprite,
  [SPELL_SCROLL_IDS.glue]: glueSprite,
  [SPELL_SCROLL_IDS.shock]: shockSprite,
  [SPELL_SCROLL_IDS.bomb]: bombSprite,
  [SPELL_SCROLL_IDS.nuke]: nukeSprite,
};

export { spellScrollSprites };
