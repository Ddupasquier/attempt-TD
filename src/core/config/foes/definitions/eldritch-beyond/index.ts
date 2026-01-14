import type { FoeType } from "../../../../../types/core/types";
import { voidlingFoe } from "./voidling";
import { abyssalShadeFoe } from "./abyssal-shade";
import { horrorHulkFoe } from "./horror-hulk";
import { realityWarperFoe } from "./reality-warper";
import { eldritchAnchorFoe } from "./eldritch-anchor";

const eldritch_beyondFaction = {
  name: "Eldritch Beyond",
  enemies: [
    voidlingFoe,
    abyssalShadeFoe,
    horrorHulkFoe,
    realityWarperFoe,
    eldritchAnchorFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { eldritch_beyondFaction };
