import type { PixelSprite, DefenseType, SpellScrollType } from "../../core/types";
import type { UiSprite } from "../uiSpriteTypes";

type HudOverlayProps = {
  defenseTypes: DefenseType[];
  defenseSprites: Record<string, UiSprite>;
  spellScrollTypes: SpellScrollType[];
  spellScrollSprites: Record<string, UiSprite>;
  spellScrollCooldowns: Record<string, number>;
  defenseCounts: Record<string, number>;
  selectedDefenseTypeId: string | null;
  gold: number;
  hp: number;
  wave: number;
  foeFactionName: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onSelectDefense: (defenseId: string | null) => void;
  onStartDragDefense: (defenseId: string) => void;
  onStartDragSpellScroll: (spellScrollId: string) => void;
};

export type { HudOverlayProps };
