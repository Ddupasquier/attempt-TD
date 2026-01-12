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
  effects: {
    x: number;
    y: number;
    radius: number;
    time: number;
    duration: number;
  }[];
  highlightedTowerId: string | null;
  highlightAlpha: number;
  dragPreview?: DragPreview;
  targetIndicator?: {
    x: number;
    y: number;
    alpha?: number;
  };
};

type RendererOptions = {
  canvas: HTMLCanvasElement;
  pathTiles: Set<string>;
  towerSprites: Record<string, PixelSprite>;
  enemySprites: Record<string, Record<EnemyType, PixelSprite>>;
};

export type { DragPreview, FrameData, RendererOptions };
