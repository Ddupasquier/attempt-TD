import type { PixelSprite, SpellScrollType } from "../../core/types";

type SpellScrollCardProps = {
  spellScroll: SpellScrollType;
  sprite?: PixelSprite;
  isActive: boolean;
  cooldownRemaining?: number;
  onSelect: (spellScrollId: string | null) => void;
  onStartDrag: (spellScrollId: string) => void;
};

export type { SpellScrollCardProps };
