import { TOWER_IDS } from "../constants/towerIds";
import type { EnemyType, FactionId, PixelSprite } from "../types/core/types";
import { GAME_CONFIG } from "./config";

const { grid, towerTypes } = GAME_CONFIG;
const MIN_TOWER_RANGE = GAME_CONFIG.tower.minRange;

const assertTowerRanges = () => {
  const invalidTowers = towerTypes.filter((tower) => tower.range < MIN_TOWER_RANGE);
  if (invalidTowers.length > 0) {
    const names = invalidTowers.map((tower) => tower.name).join(", ");
    throw new Error(`Tower range below minimum (${MIN_TOWER_RANGE}): ${names}`);
  }
};

const pathPoints = [
  { x: 0, y: 4 },
  { x: 4, y: 4 },
  { x: 4, y: 2 },
  { x: 9, y: 2 },
  { x: 9, y: 6 },
  { x: 14, y: 6 },
  { x: 15, y: 7 },
];

const ENEMY_ARCHETYPE_PIXELS: Record<EnemyType, string[]> = {
  skirmisher: [
    "........",
    "..a.....",
    ".aa.....",
    ".ac.....",
    ".aa.....",
    "..a.....",
    ".a.a....",
    ".....a..",
  ],
  raider: [
    "..bb....",
    ".babb...",
    "baabbb..",
    "baacbb..",
    ".baab...",
    "..bb....",
    ".b..b...",
    "b....b..",
  ],
  bruiser: [
    "..bbb...",
    ".bbbbb..",
    "bbabbb..",
    "bbacbb..",
    ".bbbbb..",
    "..bbb...",
    ".bb..b..",
    "b....b..",
  ],
  bulwark: [
    "..bbbb..",
    ".bbbbbb.",
    "bbbbbbbb",
    "bbbacbbb",
    "bbbbbbbb",
    ".bbbbbb.",
    "..bbbb..",
    ".bb..bb.",
  ],
  elite: [
    "..c..c..",
    ".bbbbbb.",
    "bbabbbb.",
    "bbacbbb.",
    ".bbbabb.",
    "..bbbb..",
    ".b..b...",
    "b....b..",
  ],
  boss: [
    ".dd..dd.",
    "dbbbbbd.",
    "bbbbbbbb",
    "bbbcbbbd",
    "bbbbbbbb",
    "dbbbbbd.",
    ".d.bb.d.",
    "..d..d..",
  ],
};

const ENEMY_FACTION_PALETTES: Record<FactionId, Record<string, string>> = {
  humans: { a: "#7a6b62", b: "#c7c0b5", c: "#c14a3f", d: "#f2d5a0" },
  orcs: { a: "#2f2a25", b: "#5f8f4a", c: "#c14a3f", d: "#7a4b2f" },
  elves: { a: "#e7e1d6", b: "#6aa88f", c: "#cfa94a", d: "#f4efe6" },
  undead: { a: "#2b3a3d", b: "#6e8a8f", c: "#9fc4c9", d: "#c7c0b5" },
  dwarves: { a: "#5a4b40", b: "#b07a4a", c: "#f0dfc2", d: "#8b6b3f" },
  spirits: { a: "#e7f4ff", b: "#9bd2ff", c: "#6aa6d6", d: "#f8f4ff" },
  demons: { a: "#4a1c1c", b: "#b12c2c", c: "#f2b0a0", d: "#f2b36d" },
  dragons: { a: "#6b3c1d", b: "#cf8a3d", c: "#f2d5a0", d: "#8b6b3f" },
};

const buildEnemySprite = (pixels: string[], palette: Record<string, string>): PixelSprite => ({
  pixels,
  colors: palette,
});

const enemySprites: Record<FactionId, Record<EnemyType, PixelSprite>> = Object.fromEntries(
  Object.entries(ENEMY_FACTION_PALETTES).map(([faction, palette]) => [
    faction,
    Object.fromEntries(
      Object.entries(ENEMY_ARCHETYPE_PIXELS).map(([type, pixels]) => [type, buildEnemySprite(pixels, palette)]),
    ),
  ]),
) as Record<FactionId, Record<EnemyType, PixelSprite>>;

const towerSprites: Record<string, PixelSprite> = {
  [TOWER_IDS.mage]: {
    pixels: [
      "....xx......",
      "...xxxx.....",
      "..xHhhHx....",
      ".xHHhHHHx...",
      ".xHHHHHHx...",
      "..xHHHHx....",
      "..xBBeeBx...",
      ".xBBBBBbx.s.",
      ".xBBBBbbx.s.",
      "xBBBBBBBBx.s",
      "xBBBBbBBxxS.",
      ".xBBBBBBxxS.",
    ],
    colors: {
      x: "#1a1a1a",
      H: "#8a5a2b",
      h: "#b6813a",
      B: "#2e5fa8",
      b: "#1f3f70",
      e: "#f4d35e",
      s: "#caa06a",
      S: "#8b6b3f",
    },
  },
  [TOWER_IDS.archer]: {
    pixels: [
      "....xx......",
      "...xGGx.....",
      "..xGGGGx....",
      ".xGGgGGGx...",
      ".xGgGgGGx...",
      "..xGGGGx....",
      "..xEEeeEx...",
      ".xEEEEEex...",
      ".xEEeeEex...",
      "xEEEEEEEEs.",
      "xEEEeEExxs.",
      ".xEEEEExxs.",
    ],
    colors: {
      x: "#1a1a1a",
      G: "#2f6b4b",
      g: "#3c8a5f",
      E: "#e7c27d",
      e: "#c59b53",
      s: "#8b6b3f",
    },
  },
  [TOWER_IDS.blade]: {
    pixels: [
      "....xx......",
      "...xRRx.....",
      "..xRRRRx....",
      ".xRRrRRRx...",
      ".xRRRRRRx...",
      "..xRRRRx....",
      "..xWWwwWx...",
      ".xWWWWWwx...",
      ".xWWwwWwx...",
      "xWWWWWWWWs.",
      "xWWWwWWxxs.",
      ".xWWWWWxxs.",
    ],
    colors: {
      x: "#1a1a1a",
      R: "#8a3b3b",
      r: "#b14b4b",
      W: "#c7c0b5",
      w: "#9f968a",
      s: "#8b6b3f",
    },
  },
  [TOWER_IDS.warden]: {
    pixels: [
      "....xx......",
      "...xSSx.....",
      "..xSSSSx....",
      ".xSSsSSSx...",
      ".xSSSSSSx...",
      "..xSSSSx....",
      "..xUUuuUx...",
      ".xUUUUUux...",
      ".xUUuuUux...",
      "xUUUUUQQQt.",
      "xUUuUQQxxt.",
      ".xUUUQQxxt.",
    ],
    colors: {
      x: "#1a1a1a",
      S: "#6c7b86",
      s: "#8a99a3",
      U: "#8ab4d6",
      u: "#6d98bc",
      Q: "#c7c0b5",
      t: "#8b6b3f",
    },
  },
  [TOWER_IDS.catapult]: {
    pixels: [
      "....xx......",
      "...xTTx.....",
      "..xTTTTx....",
      ".xTttTTTx...",
      ".xTTTTTTx...",
      "..xTTTTx....",
      "..xCCccCx...",
      ".xCCCCCCx...",
      ".xCCccCCx...",
      "xCCCCCCCCx..",
      "xCCcCCxCCx..",
      ".xCCCCCCx...",
    ],
    colors: {
      x: "#1a1a1a",
      T: "#6b4d2e",
      t: "#8a6b42",
      C: "#b07a4a",
      c: "#8b6b3f",
    },
  },
};

export {
  MIN_TOWER_RANGE,
  assertTowerRanges,
  enemySprites,
  grid,
  pathPoints,
  towerSprites,
  towerTypes,
};
