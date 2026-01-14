import type { FoeType } from "../../../../../types/core/types";
import { impSkitterFoe } from "./imp-skitter";
import { hellboundLegionnaireFoe } from "./hellbound-legionnaire";
import { ironcladEnforcerFoe } from "./ironclad-enforcer";
import { infernalAdjudicatorFoe } from "./infernal-adjudicator";
import { contractWardenFoe } from "./contract-warden";

const infernal_contractFaction = {
  name: "Infernal Contract",
  enemies: [
    impSkitterFoe,
    hellboundLegionnaireFoe,
    ironcladEnforcerFoe,
    infernalAdjudicatorFoe,
    contractWardenFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { infernal_contractFaction };
