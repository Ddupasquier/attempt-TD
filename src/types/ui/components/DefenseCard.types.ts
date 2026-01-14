import type { PixelSprite, DefenseType } from "../../core/types";

type DefenseCardProps = {
  defense: DefenseType;
  sprite: PixelSprite | undefined;
  isActive: boolean;
  canAfford: boolean;
  cost: number;
  onSelect: (defenseId: string | null) => void;
  onStartDrag: (defenseId: string) => void;
};

export type { DefenseCardProps };
