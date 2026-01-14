import type { FoeType } from "../../../../../types/core/types";
import { scaledSkitterFoe } from "./scaled-skitter";
import { coilbladeFoe } from "./coilblade";
import { shedskinGuardFoe } from "./shedskin-guard";
import { venomOracleFoe } from "./venom-oracle";
import { serpentPatriarchFoe } from "./serpent-patriarch";

const yuan_ti_coilFaction = {
  name: "Yuan-Ti Coil",
  enemies: [
    scaledSkitterFoe,
    coilbladeFoe,
    shedskinGuardFoe,
    venomOracleFoe,
    serpentPatriarchFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { yuan_ti_coilFaction };
