import type { Enemy, PixelSprite, Projectile, Tower } from "../core/types";
import { tileCenter } from "../core/geometry";

function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sprite: PixelSprite,
  pixelSize: number,
) {
  const height = sprite.pixels.length;
  const width = sprite.pixels[0]?.length ?? 0;
  const startX = centerX - (width * pixelSize) / 2;
  const startY = centerY - (height * pixelSize) / 2;

  for (let row = 0; row < height; row += 1) {
    const line = sprite.pixels[row];
    for (let col = 0; col < width; col += 1) {
      const key = line[col];
      if (key === "." || !key) continue;
      const color = sprite.colors[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(startX + col * pixelSize, startY + row * pixelSize, pixelSize, pixelSize);
    }
  }
}

export function drawGrid(ctx: CanvasRenderingContext2D, size: number, cols: number, rows: number) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
  for (let c = 0; c <= cols; c += 1) {
    ctx.beginPath();
    ctx.moveTo(c * size, 0);
    ctx.lineTo(c * size, rows * size);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r += 1) {
    ctx.beginPath();
    ctx.moveTo(0, r * size);
    ctx.lineTo(cols * size, r * size);
    ctx.stroke();
  }
}

export function drawPath(
  ctx: CanvasRenderingContext2D,
  size: number,
  pathTiles: Set<string>,
) {
  ctx.fillStyle = "rgba(126, 94, 74, 0.85)";
  for (const tile of pathTiles) {
    const [col, row] = tile.split(",").map(Number);
    ctx.fillRect(col * size, row * size, size, size);
  }
}

export function drawTowers(
  ctx: CanvasRenderingContext2D,
  size: number,
  towers: Tower[],
  towerSprites: Record<string, PixelSprite>,
) {
  for (const tower of towers) {
    const center = tileCenter(tower.col, tower.row, size);
    const sprite = towerSprites[tower.type.id];
    const pixelSize = size * 0.07;
    if (sprite) {
      drawPixelSprite(ctx, center.x, center.y, sprite, pixelSize);
    } else {
      ctx.fillStyle = tower.type.color;
      ctx.beginPath();
      ctx.arc(center.x, center.y, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(center.x, center.y, tower.type.range * size, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawEnemies(
  ctx: CanvasRenderingContext2D,
  size: number,
  enemies: Enemy[],
  enemySprites: Record<string, PixelSprite>,
) {
  for (const enemy of enemies) {
    if (enemy.x === undefined || enemy.y === undefined) continue;
    const sprite = enemySprites[enemy.faction] ?? enemySprites.orcs;
    drawPixelSprite(ctx, enemy.x, enemy.y, sprite, size * 0.07);

    const hpWidth = size * 0.5;
    const hpHeight = 4;
    const hpX = enemy.x - hpWidth / 2;
    const hpY = enemy.y - size * 0.35;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(hpX, hpY, hpWidth, hpHeight);
    ctx.fillStyle = "#89d185";
    ctx.fillRect(hpX, hpY, (hpWidth * Math.max(enemy.hp, 0)) / enemy.maxHp, hpHeight);
  }
}

export function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[]) {
  for (const bolt of projectiles) {
    const pixelSize = 3;
    ctx.fillStyle = bolt.color;
    ctx.fillRect(bolt.x - pixelSize / 2, bolt.y - pixelSize / 2, pixelSize, pixelSize);
  }
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  size: number,
  pathTiles: Set<string>,
  towers: Tower[],
  enemies: Enemy[],
  projectiles: Projectile[],
  towerSprites: Record<string, PixelSprite>,
  enemySprites: Record<string, PixelSprite>,
  cols: number,
  rows: number,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  ctx.fillStyle = "#1f1a18";
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  drawPath(ctx, size, pathTiles);
  drawGrid(ctx, size, cols, rows);
  drawTowers(ctx, size, towers, towerSprites);
  drawEnemies(ctx, size, enemies, enemySprites);
  drawProjectiles(ctx, projectiles);
}
