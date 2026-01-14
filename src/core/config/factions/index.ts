import type { FactionConfig } from "../../../types/core/types";

const FACTION_PROGRESSION: FactionConfig[] = [
  { id: "necrotic-legion", name: "Necrotic Legion", start: 1, end: 10 },
  { id: "vampiric-court", name: "Vampiric Court", start: 11, end: 20 },
  { id: "infernal-contract", name: "Infernal Contract", start: 21, end: 30 },
  { id: "abyssal-horde", name: "Abyssal Horde", start: 31, end: 40 },
  { id: "draconic-brood", name: "Draconic Brood", start: 41, end: 50 },
  { id: "elemental-conclave", name: "Elemental Conclave", start: 51, end: 60 },
  { id: "goblin-warrens", name: "Goblin Warrens", start: 61, end: 70 },
  { id: "orcish-warclans", name: "Orcish Warclans", start: 71, end: 80 },
  { id: "giantkin-tribes", name: "Giantkin Tribes", start: 81, end: 90 },
  { id: "arcane-cabal", name: "Arcane Cabal", start: 91, end: 100 },
  { id: "illithid-dominion", name: "Illithid Dominion", start: 101, end: 110 },
  { id: "feywild-host", name: "Feywild Host", start: 111, end: 120 },
  { id: "verdant-circle", name: "Verdant Circle", start: 121, end: 130 },
  { id: "yuan-ti-coil", name: "Yuan-Ti Coil", start: 131, end: 140 },
  { id: "eldritch-beyond", name: "Eldritch Beyond", start: 141, end: 150 },
  { id: "construct-imperium", name: "Construct Imperium", start: 151, end: 9999 },
];

const getFactionForWave = (waveNumber: number) =>
  FACTION_PROGRESSION.find((faction) => waveNumber >= faction.start && waveNumber <= faction.end) ??
  FACTION_PROGRESSION[FACTION_PROGRESSION.length - 1];

export { FACTION_PROGRESSION, getFactionForWave };
