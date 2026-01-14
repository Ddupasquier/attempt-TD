import type { FoeType } from "../../../../../types/core/types";
import { drakeletFoe } from "./drakelet";
import { broodscaleFoe } from "./broodscale";
import { wyrmguardFoe } from "./wyrmguard";
import { flameSeerFoe } from "./flame-seer";
import { ancientBroodlordFoe } from "./ancient-broodlord";

const draconic_broodFaction = {
  name: "Draconic Brood",
  enemies: [
    drakeletFoe,
    broodscaleFoe,
    wyrmguardFoe,
    flameSeerFoe,
    ancientBroodlordFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { draconic_broodFaction };
