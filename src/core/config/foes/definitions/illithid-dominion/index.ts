import type { FoeType } from "../../../../../types/core/types";
import { thrallSkitterFoe } from "./thrall-skitter";
import { mindboundCultistFoe } from "./mindbound-cultist";
import { synapticHulkFoe } from "./synaptic-hulk";
import { psionicLeechFoe } from "./psionic-leech";
import { elderBrainSentinelFoe } from "./elder-brain-sentinel";

const illithid_dominionFaction = {
  name: "Illithid Dominion",
  enemies: [
    thrallSkitterFoe,
    mindboundCultistFoe,
    synapticHulkFoe,
    psionicLeechFoe,
    elderBrainSentinelFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { illithid_dominionFaction };
