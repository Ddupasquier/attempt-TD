import type { Grid } from "../types/core/types";

const getTileSize = (canvas: HTMLCanvasElement, grid: Grid) => {
  if (!grid.tileSize) {
    return Math.min(canvas.clientWidth / grid.cols, canvas.clientHeight / grid.rows);
  }
  const scale = Math.min(
    canvas.clientWidth / (grid.cols * grid.tileSize),
    canvas.clientHeight / (grid.rows * grid.tileSize),
  );
  return grid.tileSize * scale;
};

const tileCenter = (col: number, row: number, size: number) => ({
  x: col * size + size * 0.5,
  y: row * size + size * 0.5,
});

const screenToGrid = (x: number, y: number, size: number) => ({
  col: Math.floor(x / size),
  row: Math.floor(y / size),
});

export { getTileSize, screenToGrid, tileCenter };
