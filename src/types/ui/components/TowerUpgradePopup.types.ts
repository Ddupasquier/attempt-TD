import type { TowerUpgradePopup } from "../uiStateTypes";

type TowerUpgradePopupProps = {
  popup: TowerUpgradePopup;
  boundsWidth: number;
  boundsHeight: number;
  onUpgrade: (towerId: string) => void;
  onDelete: (towerId: string) => void;
  onSetTarget: (towerId: string) => void;
  onClose: () => void;
};

export type { TowerUpgradePopupProps };
