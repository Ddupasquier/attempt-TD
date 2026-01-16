import type { PixelSprite, DefenseType, SpellScrollType } from "../core/types";
import type { UiSprite } from "./uiSpriteTypes";
import type { UiState } from "./uiStateTypes";
import type { Writable } from "svelte/store";

type UiRootProps = {
  uiState: Writable<UiState>;
  defenseTypes: DefenseType[];
  defenseSprites: Record<string, UiSprite>;
  spellScrollTypes: SpellScrollType[];
  spellScrollSprites: Record<string, UiSprite>;
  onStartWave: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onToggleDamagePopups: () => void;
  onToggleSpeed: () => void;
  onSelectDefense: (defenseId: string | null) => void;
  onStartDragDefense: (defenseId: string) => void;
  onStartDragSpellScroll: (spellScrollId: string) => void;
  onUpgradeDefense: (defenseId: string) => void;
  onDeleteDefense: (defenseId: string) => void;
  onSetDefenseTarget: (defenseId: string) => void;
  onCloseDefensePopup: () => void;
  onDefeatReset: () => void;
};

export type { UiRootProps };
