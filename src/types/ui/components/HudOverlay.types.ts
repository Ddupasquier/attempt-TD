import type { PixelSprite, TowerType, TrapType } from "../../core/types";

type HudOverlayProps = {
  towerTypes: TowerType[];
  towerSprites: Record<string, PixelSprite>;
  trapTypes: TrapType[];
  trapSprites: Record<string, PixelSprite>;
  trapCooldowns: Record<string, number>;
  selectedTowerTypeId: string | null;
  gold: number;
  lives: number;
  wave: number;
  enemyFactionName: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onSelectTower: (towerId: string | null) => void;
  onStartDragTower: (towerId: string) => void;
  onStartDragTrap: (trapId: string) => void;
};

export type { HudOverlayProps };
