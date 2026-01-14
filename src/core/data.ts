import { GAME_CONFIG } from "./config";
import { defenseSprites, foeSprites, spellScrollSprites } from "./sprites";

const { grid, defenseTypes, spellScrollTypes } = GAME_CONFIG;
const MIN_DEFENSE_RANGE = GAME_CONFIG.defense.minRange;

const assertDefenseRanges = () => {
  const invalidDefenses = defenseTypes.filter((defense) => defense.range < MIN_DEFENSE_RANGE);
  if (invalidDefenses.length > 0) {
    const names = invalidDefenses.map((defense) => defense.name).join(", ");
    throw new Error(`Defense range below minimum (${MIN_DEFENSE_RANGE}): ${names}`);
  }
};

const pathPoints = [
  { x: 0, y: 4 },
  { x: 4, y: 4 },
  { x: 4, y: 2 },
  { x: 9, y: 2 },
  { x: 9, y: 6 },
  { x: 14, y: 6 },
  { x: 15, y: 7 },
];

export {
  MIN_DEFENSE_RANGE,
  assertDefenseRanges,
  foeSprites,
  grid,
  pathPoints,
  spellScrollSprites,
  spellScrollTypes,
  defenseSprites,
  defenseTypes,
};
