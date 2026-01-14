
import type { FactionId, FoeType, PixelSprite } from "../../types/core/types";

const FOE_ARCHETYPE_PIXELS: Record<FoeType, string[]> = {
  swarm: [
    "........",
    "..aa....",
    ".a.a....",
    ".aac....",
    ".aa.....",
    "..a.....",
    ".a.a....",
    "..a.....",
  ],
  grunt: [
    "..bbb...",
    ".babbb..",
    "babbab..",
    "bbacbb..",
    ".babb...",
    "..bbb...",
    ".b..b...",
    "b....b..",
  ],
  tank: [
    "..bbbb..",
    ".bbbbbb.",
    "bbbbbbbb",
    "bbbcbbbb",
    "bbbbbbbb",
    ".bbbbbb.",
    ".bbbbbb.",
    "..b..b..",
  ],
  elite: [
    "..c..c..",
    ".bbbbbb.",
    "bbbabbbb",
    "bbbcbbbb",
    ".bbbbbb.",
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

const FOE_FACTION_PALETTES: Record<FactionId, Record<string, string>> = {
  "necrotic-legion": { a: "#2f3436", b: "#7a8a8c", c: "#9fd0d4", d: "#c7c0b5" },
  "vampiric-court": { a: "#1f0f14", b: "#5a1d2d", c: "#c44a5c", d: "#e7c7cc" },
  "infernal-contract": { a: "#3d1616", b: "#b12c2c", c: "#f2b0a0", d: "#f2b36d" },
  "abyssal-horde": { a: "#241114", b: "#6c1f2b", c: "#d0604c", d: "#f2c1a0" },
  "draconic-brood": { a: "#3f2a1b", b: "#7e5c3a", c: "#f2d5a0", d: "#8b6b3f" },
  "elemental-conclave": { a: "#e7f4ff", b: "#8bc8ff", c: "#6aa6d6", d: "#f8f4ff" },
  "goblin-warrens": { a: "#2f3a2a", b: "#5f8c44", c: "#c14a3f", d: "#7a4b2f" },
  "orcish-warclans": { a: "#2a2f22", b: "#7a5c3a", c: "#c64d33", d: "#d9b07a" },
  "giantkin-tribes": { a: "#4f3c32", b: "#b07a4a", c: "#f0dfc2", d: "#8b6b3f" },
  "arcane-cabal": { a: "#2a1d3a", b: "#6b4aa3", c: "#b58ad6", d: "#e7d6ff" },
  "illithid-dominion": { a: "#1c2a2e", b: "#5a7c82", c: "#9fd0d4", d: "#d5f4f2" },
  "feywild-host": { a: "#cfe7d6", b: "#5ea884", c: "#cfa94a", d: "#f4efe6" },
  "verdant-circle": { a: "#23331e", b: "#6f9154", c: "#a5c47a", d: "#d7e6b1" },
  "yuan-ti-coil": { a: "#1f2b1b", b: "#4f7a3a", c: "#b4c15a", d: "#e7e1a5" },
  "eldritch-beyond": { a: "#141522", b: "#3f3a6b", c: "#7a6fd6", d: "#c9c2ff" },
  "construct-imperium": { a: "#2d2d2f", b: "#7a7f86", c: "#c4c8cf", d: "#e7edf2" },
};

const buildEnemySprite = (pixels: string[], palette: Record<string, string>): PixelSprite => ({
  pixels,
  colors: palette,
});

const foeSprites: Record<FactionId, Record<FoeType, PixelSprite>> = Object.fromEntries(
  Object.entries(FOE_FACTION_PALETTES).map(([faction, palette]) => [
    faction,
    Object.fromEntries(
      Object.entries(FOE_ARCHETYPE_PIXELS).map(([type, pixels]) => [type, buildEnemySprite(pixels, palette)]),
    ),
  ]),
) as Record<FactionId, Record<FoeType, PixelSprite>>;

export { foeSprites };
