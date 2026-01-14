import type { FoeType } from "../../../../../types/core/types";
import { spriteDartFoe } from "./sprite-dart";
import { glimmerbladeFoe } from "./glimmerblade";
import { briarbackFoe } from "./briarback";
import { mistweaverFoe } from "./mistweaver";
import { feySovereignFoe } from "./fey-sovereign";

const feywild_hostFaction = {
  name: "Feywild Host",
  enemies: [
    spriteDartFoe,
    glimmerbladeFoe,
    briarbackFoe,
    mistweaverFoe,
    feySovereignFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { feywild_hostFaction };
