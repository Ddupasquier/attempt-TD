import type { Foe, FoeType, PixelSprite, Projectile, Defense, SpellScroll } from "../core/types";
import type { UiSprite } from "../ui/uiSpriteTypes";

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
  defenses: Defense[];
  spellScrolls: SpellScroll[];
  foes: Foe[];
  projectiles: Projectile[];
  effects: {
    x: number;
    y: number;
    radius: number;
    time: number;
    duration: number;
  }[];
  damagePopups: {
    x: number;
    y: number;
    value: number;
    color?: string;
    sizeMult?: number;
    time: number;
    duration: number;
  }[];
  highlightedDefenseId: string | null;
  highlightAlpha: number;
  dragPreview?: DragPreview;
  spellScrollPreview?: {
    x: number;
    y: number;
    radius?: number;
    spriteId?: string;
  };
  targetIndicator?: {
    x: number;
    y: number;
    alpha?: number;
  };
};

type RendererOptions = {
  canvas: HTMLCanvasElement;
  pathTiles: Set<string>;
  defenseSprites: Record<string, UiSprite>;
  spellScrollSprites: Record<string, UiSprite>;
  foeSprites: Record<string, Record<FoeType, PixelSprite>>;
};

export type { DragPreview, FrameData, RendererOptions };
