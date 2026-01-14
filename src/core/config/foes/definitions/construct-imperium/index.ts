import type { FoeType } from "../../../../../types/core/types";
import { clockworkSkitterFoe } from "./clockwork-skitter";
import { steelVanguardFoe } from "./steel-vanguard";
import { siegeAutomatonFoe } from "./siege-automaton";
import { arcCoilFoe } from "./arc-coil";
import { imperialColossusFoe } from "./imperial-colossus";

const construct_imperiumFaction = {
  name: "Construct Imperium",
  enemies: [
    clockworkSkitterFoe,
    steelVanguardFoe,
    siegeAutomatonFoe,
    arcCoilFoe,
    imperialColossusFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { construct_imperiumFaction };
