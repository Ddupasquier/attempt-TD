import type { DefenseUpgradePopup } from "../uiStateTypes";

type DefenseUpgradePopupProps = {
  popup: DefenseUpgradePopup;
  boundsWidth: number;
  boundsHeight: number;
  onUpgrade: (defenseId: string) => void;
  onDelete: (defenseId: string) => void;
  onSetTarget: (defenseId: string) => void;
  onClose: () => void;
};

export type { DefenseUpgradePopupProps };
