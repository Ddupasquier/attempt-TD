import type { FactionConfig, FactionId, Grid, PixelSprite, TowerType } from "./types";

const grid: Grid = { cols: 16, rows: 9 };
const MIN_TOWER_RANGE = 1.3;

const towerTypes: TowerType[] = [
  {
    id: "mage",
    name: "Arcane Tower",
    cost: 60,
    range: 1.9,
    rate: 0.9,
    damage: 13,
    knockback: 0,
    color: "#7fd1b9",
    description: "Magic bolts, long range.",
  },
  {
    id: "archer",
    name: "Elven Archer",
    cost: 45,
    range: 2.6,
    rate: 0.6,
    damage: 8,
    knockback: 0,
    color: "#e7c27d",
    description: "Fast arrows.",
  },
  {
    id: "blade",
    name: "Sword Guard",
    cost: 35,
    range: 1.3,
    rate: 0.5,
    damage: 11,
    knockback: 0,
    color: "#d16f7a",
    description: "Short reach, hard hit.",
  },
  {
    id: "warden",
    name: "Aegis Warden",
    cost: 55,
    range: 1.3,
    rate: 0.5,
    damage: 2,
    knockback: 0.35,
    color: "#7aa6c9",
    description: "Shield bash, knocks foes back.",
  },
];

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

const enemySprites: Record<FactionId, PixelSprite> = {
  humans: {
    pixels: [
      "..ss....",
      ".sppp...",
      "spppps..",
      "spccps..",
      ".sppp...",
      "..ss....",
      ".s..s...",
      "s....s..",
    ],
    colors: {
      s: "#c7c0b5",
      p: "#7a6b62",
      c: "#c14a3f",
    },
  },
  orcs: {
    pixels: [
      "..gg....",
      ".gllg...",
      "gllllg..",
      "gkllkg..",
      ".gggg...",
      "..gg....",
      ".g..g...",
      "g....g..",
    ],
    colors: {
      g: "#5f8f4a",
      l: "#2f2a25",
      k: "#c14a3f",
    },
  },
  elves: {
    pixels: [
      "..ee....",
      ".eppp...",
      "eppppe..",
      "epffee..",
      ".eppp...",
      "..ee....",
      ".e..e...",
      "e....e..",
    ],
    colors: {
      e: "#6aa88f",
      p: "#e7e1d6",
      f: "#cfa94a",
    },
  },
  undead: {
    pixels: [
      "..uu....",
      ".uqqq...",
      "uqqqqu..",
      "uqrrqu..",
      ".uqqq...",
      "..uu....",
      ".u..u...",
      "u....u..",
    ],
    colors: {
      u: "#6e8a8f",
      q: "#2b3a3d",
      r: "#9fc4c9",
    },
  },
  dwarves: {
    pixels: [
      "..dd....",
      ".dppp...",
      "dppppd..",
      "dpbbpd..",
      ".dppp...",
      "..dd....",
      ".d..d...",
      "d....d..",
    ],
    colors: {
      d: "#b07a4a",
      p: "#f0dfc2",
      b: "#5a4b40",
    },
  },
  spirits: {
    pixels: [
      "..ss....",
      ".swws...",
      "swwwws..",
      "swttws..",
      ".swws...",
      "..ss....",
      ".s..s...",
      "s....s..",
    ],
    colors: {
      s: "#9bd2ff",
      w: "#e7f4ff",
      t: "#6aa6d6",
    },
  },
  demons: {
    pixels: [
      "..dd....",
      ".drrd...",
      "drrrrd..",
      "drkkrd..",
      ".drrd...",
      "..dd....",
      ".d..d...",
      "d....d..",
    ],
    colors: {
      d: "#b12c2c",
      r: "#f2b0a0",
      k: "#4a1c1c",
    },
  },
  dragons: {
    pixels: [
      "..gg....",
      ".gddg...",
      "gddddg..",
      "gdffdg..",
      ".gddg...",
      "..gg....",
      ".g..g...",
      "g....g..",
    ],
    colors: {
      g: "#cf8a3d",
      d: "#f2d5a0",
      f: "#6b3c1d",
    },
  },
};

const towerSprites: Record<string, PixelSprite> = {
  mage: {
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
  archer: {
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
  blade: {
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
  warden: {
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
};

const factionProgression: FactionConfig[] = [
  { id: "humans", name: "Human Vanguard", start: 1, end: 10 },
  { id: "orcs", name: "Orc Marauders", start: 11, end: 20 },
  { id: "elves", name: "Elven Raiders", start: 21, end: 30 },
  { id: "undead", name: "Undead Legion", start: 31, end: 40 },
  { id: "dwarves", name: "Dwarven Reavers", start: 41, end: 50 },
  { id: "spirits", name: "Spirit Host", start: 51, end: 60 },
  { id: "demons", name: "Demonic Horde", start: 61, end: 70 },
  { id: "dragons", name: "Dragonkin", start: 71, end: 9999 },
];

const getFactionForWave = (waveNumber: number) =>
  factionProgression.find((faction) => waveNumber >= faction.start && waveNumber <= faction.end) ??
  factionProgression[factionProgression.length - 1];

export {
  MIN_TOWER_RANGE,
  assertTowerRanges,
  enemySprites,
  factionProgression,
  getFactionForWave,
  grid,
  pathPoints,
  towerSprites,
  towerTypes,
};
