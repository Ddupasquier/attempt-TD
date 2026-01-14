import type { FoeType } from "../../../../../types/core/types";
import { bloodthrallSkulkerFoe } from "./bloodthrall-skulker";
import { crimsonDuelistFoe } from "./crimson-duelist";
import { nightfangBruteFoe } from "./nightfang-brute";
import { sanguineAristocratFoe } from "./sanguine-aristocrat";
import { elderBloodRegentFoe } from "./elder-blood-regent";

const vampiric_courtFaction = {
  name: "Vampiric Court",
  enemies: [
    bloodthrallSkulkerFoe,
    crimsonDuelistFoe,
    nightfangBruteFoe,
    sanguineAristocratFoe,
    elderBloodRegentFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { vampiric_courtFaction };
