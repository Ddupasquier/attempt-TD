export function buildPathTiles(pathPoints: Array<{ x: number; y: number }>) {
  const pathTiles = new Set<string>();

  for (let i = 0; i < pathPoints.length - 1; i += 1) {
    const start = pathPoints[i];
    const end = pathPoints[i + 1];
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    let x = start.x;
    let y = start.y;
    pathTiles.add(`${x},${y}`);
    while (x !== end.x || y !== end.y) {
      x += dx;
      y += dy;
      pathTiles.add(`${x},${y}`);
    }
  }

  return pathTiles;
}
