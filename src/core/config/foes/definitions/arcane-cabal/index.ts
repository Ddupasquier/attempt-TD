import type { FoeType } from "../../../../../types/core/types";
import { sparkAdeptFoe } from "./spark-adept";
import { cabalDiscipleFoe } from "./cabal-disciple";
import { runicGolemFoe } from "./runic-golem";
import { veilbinderFoe } from "./veilbinder";
import { archmagusAnchorFoe } from "./archmagus-anchor";

const arcane_cabalFaction = {
  name: "Arcane Cabal",
  enemies: [
    sparkAdeptFoe,
    cabalDiscipleFoe,
    runicGolemFoe,
    veilbinderFoe,
    archmagusAnchorFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { arcane_cabalFaction };
