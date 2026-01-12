/// <reference types="vite/client" />

import * as fallback from "./isDev.example";

type DamagePopupStyle = {
  color?: string;
  duration?: number;
  sizeMult?: number;
};

type DevFlags = {
  IS_DEV?: boolean;
  getCatapultDamagePopupStyle?: () => DamagePopupStyle;
};

const localModules = import.meta.glob("./isDev.ts", { eager: true });
const local = Object.values(localModules)[0] as DevFlags | undefined;

if (!local && import.meta.env.DEV) {
  console.warn("Missing src/core/isDev.ts. Using defaults from isDev.example.ts.");
}

const resolved = local ?? fallback;
const IS_DEV = resolved.IS_DEV ?? false;
const getCatapultDamagePopupStyle = resolved.getCatapultDamagePopupStyle ?? (() => ({} as DamagePopupStyle));

export type { DamagePopupStyle };
export { IS_DEV, getCatapultDamagePopupStyle };
