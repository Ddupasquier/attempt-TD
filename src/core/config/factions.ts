import type { FactionConfig } from "../../types/core/types";

const FACTION_PROGRESSION: FactionConfig[] = [
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
  FACTION_PROGRESSION.find((faction) => waveNumber >= faction.start && waveNumber <= faction.end) ??
  FACTION_PROGRESSION[FACTION_PROGRESSION.length - 1];

export { FACTION_PROGRESSION, getFactionForWave };
