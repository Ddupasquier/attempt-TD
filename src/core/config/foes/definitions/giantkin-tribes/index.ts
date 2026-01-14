import type { FoeType } from "../../../../../types/core/types";
import { hillSkirmisherFoe } from "./hill-skirmisher";
import { cragStomperFoe } from "./crag-stomper";
import { stonebreakerFoe } from "./stonebreaker";
import { stormCallerFoe } from "./storm-caller";
import { titanChieftainFoe } from "./titan-chieftain";

const giantkin_tribesFaction = {
  name: "Giantkin Tribes",
  enemies: [
    hillSkirmisherFoe,
    cragStomperFoe,
    stonebreakerFoe,
    stormCallerFoe,
    titanChieftainFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { giantkin_tribesFaction };
