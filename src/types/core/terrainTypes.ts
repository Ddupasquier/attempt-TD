type TerrainFeature =
  | { type: "tree"; variant: number }
  | { type: "stump" }
  | { type: "rock"; variant: number }
  | { type: "flower" }
  | { type: "none" };

export type { TerrainFeature };
