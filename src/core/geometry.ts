import type { Grid } from "./types";

export function getTileSize(canvas: HTMLCanvasElement, grid: Grid) {
  return Math.min(canvas.clientWidth / grid.cols, canvas.clientHeight / grid.rows);
}

export function tileCenter(col: number, row: number, size: number) {
  return {
    x: col * size + size * 0.5,
    y: row * size + size * 0.5,
  };
}

export function screenToGrid(x: number, y: number, size: number) {
  return {
    col: Math.floor(x / size),
    row: Math.floor(y / size),
  };
}
