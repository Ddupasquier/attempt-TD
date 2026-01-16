import type { DefenseType } from "../../core/types";
import type { UiSprite } from "../uiSpriteTypes";

type DefenseCardProps = {
  defense: DefenseType;
  sprite: UiSprite | undefined;
  isActive: boolean;
  canAfford: boolean;
  cost: number;
  onSelect: (defenseId: string | null) => void;
  onStartDrag: (defenseId: string) => void;
};

export type { DefenseCardProps };
