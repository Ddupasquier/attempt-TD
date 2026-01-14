import type { PixelSprite, TrapType } from "../../core/types";

type TrapCardProps = {
  trap: TrapType;
  sprite?: PixelSprite;
  isActive: boolean;
  cooldownRemaining?: number;
  onSelect: (trapId: string | null) => void;
  onStartDrag: (trapId: string) => void;
};

export type { TrapCardProps };
