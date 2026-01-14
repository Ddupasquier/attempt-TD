import type { FoeType } from "../../../../../types/core/types";
import { rageRunnerFoe } from "./rage-runner";
import { warclanRaiderFoe } from "./warclan-raider";
import { ironhideFoe } from "./ironhide";
import { battleHeraldFoe } from "./battle-herald";
import { warchiefFoe } from "./warchief";

const orcish_warclansFaction = {
  name: "Orcish Warclans",
  enemies: [
    rageRunnerFoe,
    warclanRaiderFoe,
    ironhideFoe,
    battleHeraldFoe,
    warchiefFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { orcish_warclansFaction };
