import type { FoeType } from "../../../../../types/core/types";
import { saplingSkitterFoe } from "./sapling-skitter";
import { rotbarkStalkerFoe } from "./rotbark-stalker";
import { thornbruteFoe } from "./thornbrute";
import { sporecallerFoe } from "./sporecaller";
import { blightTreantFoe } from "./blight-treant";

const verdant_circleFaction = {
  name: "Verdant Circle",
  enemies: [
    saplingSkitterFoe,
    rotbarkStalkerFoe,
    thornbruteFoe,
    sporecallerFoe,
    blightTreantFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { verdant_circleFaction };
