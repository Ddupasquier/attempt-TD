import type { Enemy, PixelSprite, Projectile, Tower } from "../core/types";
import { getTerrainFeatureAtTile } from "../core/terrain";
import { tileCenter } from "../core/geometry";

const drawPixelSprite = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  sprite: PixelSprite,
  pixelSize: number,
) => {
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
};

const drawGrid = (ctx: CanvasRenderingContext2D, size: number, cols: number, rows: number) => {
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
};

const drawPath = (
  ctx: CanvasRenderingContext2D,
  size: number,
  pathTiles: Set<string>,
) => {
  const micro = 12;
  const pixel = size / micro;

  for (const tile of pathTiles) {
    const [col, row] = tile.split(",").map(Number);
    const tileX = col * size;
    const tileY = row * size;
    const hasTop = pathTiles.has(`${col},${row - 1}`);
    const hasBottom = pathTiles.has(`${col},${row + 1}`);
    const hasLeft = pathTiles.has(`${col - 1},${row}`);
    const hasRight = pathTiles.has(`${col + 1},${row}`);

    for (let py = 0; py < micro; py += 1) {
      for (let px = 0; px < micro; px += 1) {
        const edgeTop = py === 0;
        const edgeBottom = py === micro - 1;
        const edgeLeft = px === 0;
        const edgeRight = px === micro - 1;

        const onOuterEdge =
          (!hasTop && edgeTop) ||
          (!hasBottom && edgeBottom) ||
          (!hasLeft && edgeLeft) ||
          (!hasRight && edgeRight);

        if (onOuterEdge) {
          const edgeNoise = hash(col * micro + px, row * micro + py, 4) % 100;
          if (edgeNoise < 42) {
            continue;
          }
        }

        const dirtRoll = hash(col * micro + px, row * micro + py, 5) % 100;
        if (dirtRoll < 10) {
          ctx.fillStyle = "#caa870";
        } else if (dirtRoll < 20) {
          ctx.fillStyle = "#dfc18c";
        } else if (dirtRoll < 30) {
          ctx.fillStyle = "#b88c58";
        } else {
          ctx.fillStyle = "#c9a26b";
        }

        ctx.fillRect(tileX + px * pixel, tileY + py * pixel, pixel, pixel);
      }
    }

    const pebbleRoll = hash(col, row, 6) % 100;
    if (pebbleRoll < 60) {
      ctx.fillStyle = "#e0d1b3";
      ctx.fillRect(tileX + pixel * 2, tileY + pixel * 3, pixel, pixel);
      ctx.fillRect(tileX + pixel * 8, tileY + pixel * 6, pixel, pixel);
    }
    if (pebbleRoll < 30) {
      ctx.fillStyle = "#9a876c";
      ctx.fillRect(tileX + pixel * 6, tileY + pixel * 2, pixel, pixel);
    }
  }
};

const hash = (col: number, row: number, salt: number) => {
  let value = (col + 37) * 928371 + (row + 17) * 523987 + salt * 9349;
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;
  return Math.abs(value);
};

const drawTerrain = (
  ctx: CanvasRenderingContext2D,
  size: number,
  cols: number,
  rows: number,
  pathTiles: Set<string>,
) => {
  const micro = 12;
  const pixel = size / micro;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const tileKey = `${col},${row}`;
      const tileX = col * size;
      const tileY = row * size;

      for (let py = 0; py < micro; py += 1) {
        for (let px = 0; px < micro; px += 1) {
          const grassRoll = hash(col * micro + px, row * micro + py, 1) % 100;
          if (grassRoll < 10) {
            ctx.fillStyle = "#6cab2f";
          } else if (grassRoll < 20) {
            ctx.fillStyle = "#87c33f";
          } else if (grassRoll < 30) {
            ctx.fillStyle = "#9ad54c";
          } else if (grassRoll < 38) {
            ctx.fillStyle = "#5fa62a";
          } else {
            ctx.fillStyle = "#78b935";
          }
          ctx.fillRect(tileX + px * pixel, tileY + py * pixel, pixel, pixel);
        }
      }

      const feature = getTerrainFeatureAtTile(col, row, pathTiles);
      if (feature.type === "tree") {
        if (feature.variant === 0) {
          ctx.fillStyle = "#3a5c2b";
          ctx.fillRect(tileX + pixel * 4, tileY + pixel * 7, pixel * 3, pixel * 3);
          ctx.fillStyle = "#4f7b36";
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 3, pixel * 7, pixel * 5);
          ctx.fillStyle = "#6fa746";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 2, pixel * 5, pixel * 2);
          ctx.fillStyle = "#3b2b1b";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 3);
        } else if (feature.variant === 1) {
          ctx.fillStyle = "#2f5a30";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 7, pixel * 2, pixel * 3);
          ctx.fillStyle = "#3f7b3f";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 3, pixel * 6, pixel * 5);
          ctx.fillStyle = "#5fa649";
          ctx.fillRect(tileX + pixel * 4, tileY + pixel * 1, pixel * 4, pixel * 2);
          ctx.fillStyle = "#3b2b1b";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 2);
        } else if (feature.variant === 2) {
          ctx.fillStyle = "#365b2a";
          ctx.fillRect(tileX + pixel * 4, tileY + pixel * 6, pixel * 4, pixel * 4);
          ctx.fillStyle = "#4f7b36";
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 3, pixel * 8, pixel * 4);
          ctx.fillStyle = "#6fa746";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 2, pixel * 6, pixel * 2);
          ctx.fillStyle = "#3b2b1b";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 3);
        } else {
          ctx.fillStyle = "#2e532b";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 6, pixel * 2, pixel * 4);
          ctx.fillStyle = "#4a7536";
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 4, pixel * 8, pixel * 4);
          ctx.fillStyle = "#6fa746";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 2, pixel * 6, pixel * 2);
          ctx.fillStyle = "#3b2b1b";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 2);
        }
      } else if (feature.type === "stump") {
        ctx.fillStyle = "#b58a55";
        ctx.fillRect(tileX + pixel * 4, tileY + pixel * 7, pixel * 4, pixel * 3);
        ctx.fillStyle = "#906d44";
        ctx.fillRect(tileX + pixel * 5, tileY + pixel * 8, pixel * 2, pixel);
      } else if (feature.type === "rock") {
        if (feature.variant === 0) {
          ctx.fillStyle = "#8c8a80";
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 8, pixel * 3, pixel * 2);
          ctx.fillRect(tileX + pixel * 7, tileY + pixel * 6, pixel * 2, pixel * 2);
          ctx.fillStyle = "#a7a39a";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 7, pixel, pixel);
        } else if (feature.variant === 1) {
          ctx.fillStyle = "#7f7b73";
          ctx.fillRect(tileX + pixel * 5, tileY + pixel * 7, pixel * 3, pixel * 2);
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 6, pixel * 2, pixel * 2);
          ctx.fillStyle = "#b6b1a6";
          ctx.fillRect(tileX + pixel * 6, tileY + pixel * 6, pixel, pixel);
        } else if (feature.variant === 2) {
          ctx.fillStyle = "#8f8b82";
          ctx.fillRect(tileX + pixel * 3, tileY + pixel * 7, pixel * 4, pixel * 2);
          ctx.fillRect(tileX + pixel * 7, tileY + pixel * 5, pixel * 2, pixel * 2);
          ctx.fillStyle = "#bdb7ad";
          ctx.fillRect(tileX + pixel * 4, tileY + pixel * 6, pixel, pixel);
        } else {
          ctx.fillStyle = "#8a867f";
          ctx.fillRect(tileX + pixel * 2, tileY + pixel * 7, pixel * 2, pixel * 2);
          ctx.fillRect(tileX + pixel * 6, tileY + pixel * 7, pixel * 3, pixel * 2);
          ctx.fillStyle = "#b1aca2";
          ctx.fillRect(tileX + pixel * 7, tileY + pixel * 6, pixel, pixel);
        }
      } else if (feature.type === "flower") {
        ctx.fillStyle = "#f0d86d";
        ctx.fillRect(tileX + pixel * 2, tileY + pixel * 4, pixel, pixel);
        ctx.fillRect(tileX + pixel * 8, tileY + pixel * 5, pixel, pixel);
        ctx.fillStyle = "#ff8b7a";
        ctx.fillRect(tileX + pixel * 5, tileY + pixel * 9, pixel, pixel);
      }
    }
  }
};

const drawPathDetails = (
  ctx: CanvasRenderingContext2D,
  size: number,
  pathTiles: Set<string>,
) => {
  const micro = 12;
  const pixel = size / micro;

  for (const tile of pathTiles) {
    const [col, row] = tile.split(",").map(Number);
    const tileX = col * size;
    const tileY = row * size;
    const scatter = hash(col, row, 7) % 10;

    if (scatter > 3) {
      ctx.fillStyle = "#a9875b";
      ctx.fillRect(tileX + pixel * 1, tileY + pixel * 2, pixel * 2, pixel);
      ctx.fillRect(tileX + pixel * 7, tileY + pixel * 4, pixel * 2, pixel);
    }
    if (scatter > 6) {
      ctx.fillStyle = "#7b6246";
      ctx.fillRect(tileX + pixel * 3, tileY + pixel * 7, pixel, pixel);
    }
  }
};

const drawTowers = (
  ctx: CanvasRenderingContext2D,
  size: number,
  towers: Tower[],
  towerSprites: Record<string, PixelSprite>,
  highlightedTowerId: string | null,
  highlightAlpha: number,
) => {
  for (const tower of towers) {
    const center = tileCenter(tower.col, tower.row, size);
    const sprite = towerSprites[tower.type.id];
    if (sprite) {
      const spriteWidth = sprite.pixels[0]?.length ?? 8;
      const pixelSize = (size * 0.56) / spriteWidth;
      drawPixelSprite(ctx, center.x, center.y, sprite, pixelSize);
    } else {
      ctx.fillStyle = tower.type.color;
      ctx.beginPath();
      ctx.arc(center.x, center.y, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }

    if (highlightedTowerId === tower.id && highlightAlpha > 0) {
      ctx.lineWidth = Math.max(1.5, size * 0.04);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * highlightAlpha})`;
      ctx.beginPath();
      ctx.arc(center.x, center.y, (tower.type.range + tower.rangeBonus) * size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
  }
};

const drawEnemies = (
  ctx: CanvasRenderingContext2D,
  size: number,
  enemies: Enemy[],
  enemySprites: Record<string, PixelSprite>,
) => {
  for (const enemy of enemies) {
    if (enemy.x === undefined || enemy.y === undefined) continue;
    const sprite = enemySprites[enemy.faction] ?? enemySprites.orcs;
    const spriteWidth = sprite.pixels[0]?.length ?? 8;
    const pixelSize = (size * 0.5) / spriteWidth;
    drawPixelSprite(ctx, enemy.x, enemy.y, sprite, pixelSize);

    const hpWidth = size * 0.5;
    const hpHeight = 4;
    const hpX = enemy.x - hpWidth / 2;
    const hpY = enemy.y - size * 0.35;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(hpX, hpY, hpWidth, hpHeight);
    ctx.fillStyle = "#89d185";
    ctx.fillRect(hpX, hpY, (hpWidth * Math.max(enemy.hp, 0)) / enemy.maxHp, hpHeight);
  }
};

const drawProjectiles = (ctx: CanvasRenderingContext2D, projectiles: Projectile[]) => {
  for (const bolt of projectiles) {
    const pixelSize = 3;
    ctx.fillStyle = bolt.color;
    ctx.fillRect(bolt.x - pixelSize / 2, bolt.y - pixelSize / 2, pixelSize, pixelSize);
  }
};

const drawFrame = (
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
  highlightedTowerId: string | null,
  highlightAlpha: number,
  dragPreview?: {
    x: number;
    y: number;
    range: number;
    color: string;
    sprite?: PixelSprite;
  },
) => {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  drawTerrain(ctx, size, cols, rows, pathTiles);
  drawPath(ctx, size, pathTiles);
  drawPathDetails(ctx, size, pathTiles);
  drawGrid(ctx, size, cols, rows);
  drawTowers(ctx, size, towers, towerSprites, highlightedTowerId, highlightAlpha);
  drawEnemies(ctx, size, enemies, enemySprites);
  drawProjectiles(ctx, projectiles);

  if (dragPreview) {
    ctx.lineWidth = Math.max(1.5, size * 0.04);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.arc(dragPreview.x, dragPreview.y, dragPreview.range * size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    if (dragPreview.sprite) {
      const spriteWidth = dragPreview.sprite.pixels[0]?.length ?? 8;
      const pixelSize = (size * 0.56) / spriteWidth;
      drawPixelSprite(ctx, dragPreview.x, dragPreview.y, dragPreview.sprite, pixelSize);
    } else {
      ctx.fillStyle = dragPreview.color;
      ctx.beginPath();
      ctx.arc(dragPreview.x, dragPreview.y, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export { drawEnemies, drawFrame, drawGrid, drawPath, drawProjectiles, drawTowers };
