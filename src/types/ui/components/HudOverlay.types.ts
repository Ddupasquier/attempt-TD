import type { PixelSprite, DefenseType, SpellScrollType } from "../../core/types";

type HudOverlayProps = {
  defenseTypes: DefenseType[];
  defenseSprites: Record<string, PixelSprite>;
  spellScrollTypes: SpellScrollType[];
  spellScrollSprites: Record<string, PixelSprite>;
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
