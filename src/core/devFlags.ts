/// <reference types="vite/client" />

type DamagePopupStyle = {
  color?: string;
  duration?: number;
  sizeMult?: number;
};

type DevConfig = {
  enabled: boolean;
  infiniteGold: boolean;
  catapultDamagePopup: {
    enabled: boolean;
    color?: string;
    duration?: number;
    sizeMult?: number;
  };
  godMode: {
    enabled: boolean;
    invulnerableBase: boolean;
    oneShotEnemies: boolean;
    noCooldowns: boolean;
  };
};

type DevFlags = {
  IS_DEV?: boolean;
  DEV_CONFIG?: Partial<DevConfig>;
};

const localModules = import.meta.glob("./isDev.ts", { eager: true });
const local = Object.values(localModules)[0] as DevFlags | undefined;

if (!local && import.meta.env.DEV) {
  console.warn("Missing src/core/isDev.ts. Dev features are disabled.");
}

const DEFAULT_CONFIG: DevConfig = {
  enabled: false,
  infiniteGold: false,
  catapultDamagePopup: {
    enabled: false,
  },
  godMode: {
    enabled: false,
    invulnerableBase: false,
    oneShotEnemies: false,
    noCooldowns: false,
  },
};

const IS_DEV = Boolean(local?.IS_DEV);
const DEV_CONFIG: DevConfig = {
  ...DEFAULT_CONFIG,
  ...local?.DEV_CONFIG,
  catapultDamagePopup: {
    ...DEFAULT_CONFIG.catapultDamagePopup,
    ...(local?.DEV_CONFIG?.catapultDamagePopup ?? {}),
  },
  godMode: {
    ...DEFAULT_CONFIG.godMode,
    ...(local?.DEV_CONFIG?.godMode ?? {}),
  },
};

if (!IS_DEV) {
  DEV_CONFIG.enabled = false;
}

const getDevConfig = () => DEV_CONFIG;
const isDevEnabled = () => IS_DEV && DEV_CONFIG.enabled;

const getCatapultDamagePopupStyle = () => {
  if (!isDevEnabled()) return {} as DamagePopupStyle;
  return DEV_CONFIG.catapultDamagePopup.enabled ? DEV_CONFIG.catapultDamagePopup : ({} as DamagePopupStyle);
};

export type { DamagePopupStyle, DevConfig };
export { IS_DEV, getCatapultDamagePopupStyle, getDevConfig, isDevEnabled };
