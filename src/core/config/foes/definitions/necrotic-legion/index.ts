import type { FoeType } from "../../../../../types/core/types";
import { boneSkitterFoe } from "./bone-skitter";
import { graveguardLegionnaireFoe } from "./graveguard-legionnaire";
import { carrionBruteFoe } from "./carrion-brute";
import { soulWardenFoe } from "./soul-warden";
import { dreadOssuaryFoe } from "./dread-ossuary";

const necrotic_legionFaction = {
  name: "Necrotic Legion",
  enemies: [
    boneSkitterFoe,
    graveguardLegionnaireFoe,
    carrionBruteFoe,
    soulWardenFoe,
    dreadOssuaryFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { necrotic_legionFaction };
