import type { FactionId } from "../../../../types/core/types";
import { necrotic_legionFaction } from "./necrotic-legion";
import { vampiric_courtFaction } from "./vampiric-court";
import { infernal_contractFaction } from "./infernal-contract";
import { abyssal_hordeFaction } from "./abyssal-horde";
import { draconic_broodFaction } from "./draconic-brood";
import { elemental_conclaveFaction } from "./elemental-conclave";
import { goblin_warrensFaction } from "./goblin-warrens";
import { orcish_warclansFaction } from "./orcish-warclans";
import { giantkin_tribesFaction } from "./giantkin-tribes";
import { arcane_cabalFaction } from "./arcane-cabal";
import { illithid_dominionFaction } from "./illithid-dominion";
import { feywild_hostFaction } from "./feywild-host";
import { verdant_circleFaction } from "./verdant-circle";
import { yuan_ti_coilFaction } from "./yuan-ti-coil";
import { eldritch_beyondFaction } from "./eldritch-beyond";
import { construct_imperiumFaction } from "./construct-imperium";

const FOE_FACTION_DEFINITIONS = {
  "necrotic-legion": necrotic_legionFaction,
  "vampiric-court": vampiric_courtFaction,
  "infernal-contract": infernal_contractFaction,
  "abyssal-horde": abyssal_hordeFaction,
  "draconic-brood": draconic_broodFaction,
  "elemental-conclave": elemental_conclaveFaction,
  "goblin-warrens": goblin_warrensFaction,
  "orcish-warclans": orcish_warclansFaction,
  "giantkin-tribes": giantkin_tribesFaction,
  "arcane-cabal": arcane_cabalFaction,
  "illithid-dominion": illithid_dominionFaction,
  "feywild-host": feywild_hostFaction,
  "verdant-circle": verdant_circleFaction,
  "yuan-ti-coil": yuan_ti_coilFaction,
  "eldritch-beyond": eldritch_beyondFaction,
  "construct-imperium": construct_imperiumFaction,
} as Record<FactionId, { name: string; enemies: Array<{ name: string; foeType: string; mechanics: string; visual: string }> }>;

export { FOE_FACTION_DEFINITIONS };
