import type { PixelSprite, TowerType } from "../../core/types";

type HudOverlayProps = {
  towerTypes: TowerType[];
  towerSprites: Record<string, PixelSprite>;
  selectedTowerTypeId: string | null;
  gold: number;
  lives: number;
  wave: number;
  enemyFactionName: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onSelectTower: (towerId: string | null) => void;
  onStartDragTower: (towerId: string) => void;
};

export type { HudOverlayProps };
