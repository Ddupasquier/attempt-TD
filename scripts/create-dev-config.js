import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const target = resolve("src/core/isDev.ts");

if (existsSync(target)) {
  console.log("src/core/isDev.ts already exists. No changes made.");
  process.exit(0);
}

const content = `export const IS_DEV = true;

export const DEV_CONFIG = {
  enabled: true,
  infiniteGold: true,
  catapultDamagePopup: {
    enabled: true,
    color: "#c93d3d",
    duration: 1.2,
    sizeMult: 1.4,
  },
  godMode: {
    enabled: true,
    invulnerableBase: true,
    oneShotEnemies: false,
    noCooldowns: false,
  },
};
`;

writeFileSync(target, content, "utf8");
console.log("Created src/core/isDev.ts (ignored by git).");
