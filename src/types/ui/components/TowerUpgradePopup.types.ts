import type { TowerUpgradePopup } from "../uiStateTypes";

type TowerUpgradePopupProps = {
  popup: TowerUpgradePopup;
  onUpgrade: (towerId: string) => void;
  onClose: () => void;
};

export type { TowerUpgradePopupProps };
