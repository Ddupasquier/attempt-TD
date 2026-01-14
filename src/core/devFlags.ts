/// <reference types="vite/client" />

type DamagePopupStyle = {
  color?: string;
  duration?: number;
  sizeMult?: number;
};

type DevConfig = {
  enabled: boolean;
  infiniteGold: boolean;
  siegeDamagePopup: {
    enabled: boolean;
    color?: string;
    duration?: number;
    sizeMult?: number;
  };
  godMode: {
    enabled: boolean;
    invulnerableBase: boolean;
    oneShotFoes: boolean;
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
  siegeDamagePopup: {
    enabled: false,
  },
  godMode: {
    enabled: false,
    invulnerableBase: false,
    oneShotFoes: false,
    noCooldowns: false,
  },
};

const IS_DEV = Boolean(local?.IS_DEV);
const DEV_CONFIG: DevConfig = {
  ...DEFAULT_CONFIG,
  ...local?.DEV_CONFIG,
  siegeDamagePopup: {
    ...DEFAULT_CONFIG.siegeDamagePopup,
    ...(local?.DEV_CONFIG?.siegeDamagePopup ?? {}),
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

const getSiegeDamagePopupStyle = () => {
  if (!isDevEnabled()) return {} as DamagePopupStyle;
  return DEV_CONFIG.siegeDamagePopup.enabled ? DEV_CONFIG.siegeDamagePopup : ({} as DamagePopupStyle);
};

export type { DamagePopupStyle, DevConfig };
export { IS_DEV, getDevConfig, getSiegeDamagePopupStyle, isDevEnabled };
