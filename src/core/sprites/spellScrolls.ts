import { SPELL_SCROLL_IDS } from "../../constants/spellScrollIds";
import type { UiSprite } from "../../types/ui/uiSpriteTypes";
import { tacksSprite } from "./spellScrolls/tacks";
import { spikeSprite } from "./spellScrolls/spike";
import { glueSprite } from "./spellScrolls/glue";
import { shockSprite } from "./spellScrolls/shock";
import { bombSprite } from "./spellScrolls/bomb";
import apocalypticSigil from "../../assets/spell-scrolls/apocalyptic-sigil/apocalyptic-sigil-1.png?url";

const spellScrollSprites: Record<string, UiSprite> = {
  [SPELL_SCROLL_IDS.tacks]: tacksSprite,
  [SPELL_SCROLL_IDS.spike]: spikeSprite,
  [SPELL_SCROLL_IDS.glue]: glueSprite,
  [SPELL_SCROLL_IDS.shock]: shockSprite,
  [SPELL_SCROLL_IDS.bomb]: bombSprite,
  [SPELL_SCROLL_IDS.nuke]: { imageSrc: apocalypticSigil },
};

export { spellScrollSprites };
