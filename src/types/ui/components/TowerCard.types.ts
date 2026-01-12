import type { PixelSprite, TowerType } from "../../core/types";

type TowerCardProps = {
  tower: TowerType;
  sprite: PixelSprite | undefined;
  isActive: boolean;
  onSelect: (towerId: string | null) => void;
  onStartDrag: (towerId: string) => void;
};

export type { TowerCardProps };
