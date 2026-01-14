import type { FoeType } from "../../../../../types/core/types";
import { riftlingFoe } from "./riftling";
import { abyssalRavagerFoe } from "./abyssal-ravager";
import { gorehulkerFoe } from "./gorehulker";
import { warpedHexerFoe } from "./warped-hexer";
import { abyssalBehemothFoe } from "./abyssal-behemoth";

const abyssal_hordeFaction = {
  name: "Abyssal Horde",
  enemies: [
    riftlingFoe,
    abyssalRavagerFoe,
    gorehulkerFoe,
    warpedHexerFoe,
    abyssalBehemothFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { abyssal_hordeFaction };
