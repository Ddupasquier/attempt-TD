import type { Enemy, EnemyType, PixelSprite, Projectile, Tower } from "../core/types";

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
  enemySprites: Record<string, Record<EnemyType, PixelSprite>>;
};

export type { DragPreview, FrameData, RendererOptions };
