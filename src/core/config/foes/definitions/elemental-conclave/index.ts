import type { FoeType } from "../../../../../types/core/types";
import { sparkSpriteFoe } from "./spark-sprite";
import { stoneboundFoe } from "./stonebound";
import { tideColossusFoe } from "./tide-colossus";
import { tempestShamanFoe } from "./tempest-shaman";
import { primalElementalFoe } from "./primal-elemental";

const elemental_conclaveFaction = {
  name: "Elemental Conclave",
  enemies: [
    sparkSpriteFoe,
    stoneboundFoe,
    tideColossusFoe,
    tempestShamanFoe,
    primalElementalFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { elemental_conclaveFaction };
