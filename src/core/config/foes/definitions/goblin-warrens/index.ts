import type { FoeType } from "../../../../../types/core/types";
import { scuttleSneakFoe } from "./scuttle-sneak";
import { gutterRaiderFoe } from "./gutter-raider";
import { scrapbackBruiserFoe } from "./scrapback-bruiser";
import { hexslingerFoe } from "./hexslinger";
import { warrenChiefFoe } from "./warren-chief";

const goblin_warrensFaction = {
  name: "Goblin Warrens",
  enemies: [
    scuttleSneakFoe,
    gutterRaiderFoe,
    scrapbackBruiserFoe,
    hexslingerFoe,
    warrenChiefFoe,
  ] as Array<{ name: string; foeType: FoeType; mechanics: string; visual: string }>,
};

export { goblin_warrensFaction };
