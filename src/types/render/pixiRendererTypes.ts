import type { Enemy, PixelSprite, Projectile, Tower } from "../core/types";

type DragPreview = {
  x: number;
  y: number;
  range: number;
  color: string;
  spriteId?: string;
};

type FrameData = {
  size: number;
  cols: number;
  rows: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  highlightedTowerId: string | null;
  highlightAlpha: number;
  dragPreview?: DragPreview;
};

type RendererOptions = {
  canvas: HTMLCanvasElement;
  pathTiles: Set<string>;
  towerSprites: Record<string, PixelSprite>;
  enemySprites: Record<string, PixelSprite>;
};

export type { DragPreview, FrameData, RendererOptions };
