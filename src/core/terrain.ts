import type { TerrainFeature } from "../types/core/terrainTypes";

const hash = (col: number, row: number, salt: number) => {
  let value = (col + 37) * 928371 + (row + 17) * 523987 + salt * 9349;
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;
  return Math.abs(value);
};

const getTerrainFeatureAtTile = (col: number, row: number, pathTiles: Set<string>): TerrainFeature => {
  if (pathTiles.has(`${col},${row}`)) {
    return { type: "none" };
  }
  const featureRoll = hash(col, row, 2) % 100;
  if (featureRoll < 8) {
    return { type: "tree", variant: hash(col, row, 8) % 4 };
  }
  if (featureRoll < 14) {
    return { type: "stump" };
  }
  if (featureRoll < 22) {
    return { type: "rock", variant: hash(col, row, 9) % 4 };
  }
  if (featureRoll < 32) {
    return { type: "flower" };
  }
  return { type: "none" };
};

const isTreeTile = (col: number, row: number, pathTiles: Set<string>) =>
  getTerrainFeatureAtTile(col, row, pathTiles).type === "tree";

const RANGED_TREE_RANGE_BONUS = 0.4;

export { RANGED_TREE_RANGE_BONUS, getTerrainFeatureAtTile, isTreeTile };
