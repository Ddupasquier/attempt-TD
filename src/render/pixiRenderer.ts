import * as PIXI from "pixi.js";
import { getTerrainFeatureAtTile } from "../core/terrain";
import { tileCenter } from "../core/geometry";
import { getTowerStats, MAX_TOWER_LEVEL } from "../core/towerLevels";
import type { Enemy, Projectile, Tower } from "../types/core/types";
import { TOWER_IDS } from "../constants/towerIds";
import type { FrameData, RendererOptions } from "../types/render/pixiRendererTypes";

const hash = (col: number, row: number, salt: number) => {
  let value = (col + 37) * 928371 + (row + 17) * 523987 + salt * 9349;
  value ^= value << 13;
  value ^= value >> 17;
  value ^= value << 5;
  return Math.abs(value);
};

const hexToNumber = (color: string) => Number.parseInt(color.replace("#", ""), 16);

const createSpriteTexture = (sprite: PixelSprite) => {
  const width = sprite.pixels[0]?.length ?? 8;
  const height = sprite.pixels.length;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return PIXI.Texture.WHITE;
  }
  ctx.clearRect(0, 0, width, height);
  for (let row = 0; row < height; row += 1) {
    const line = sprite.pixels[row];
    for (let col = 0; col < width; col += 1) {
      const key = line[col];
      if (key === "." || !key) continue;
      const color = sprite.colors[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(col, row, 1, 1);
    }
  }
  const texture = PIXI.Texture.from(canvas);
  texture.source.scaleMode = "nearest";
  return texture;
};

const createRockTexture = (diameter = 32) => {
  const canvas = document.createElement("canvas");
  canvas.width = diameter;
  canvas.height = diameter;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return PIXI.Texture.WHITE;
  }
  const center = diameter / 2;
  const radius = diameter * 0.45;

  ctx.clearRect(0, 0, diameter, diameter);
  ctx.fillStyle = "#1f1f1f";
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#343434";
  ctx.beginPath();
  ctx.arc(center - radius * 0.2, center - radius * 0.15, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 12; i += 1) {
    const angle = ((i + 1) / 12) * Math.PI * 2;
    const jitter = (hash(i, diameter, 7) % 100) / 100;
    const edgeRadius = radius * (0.82 + jitter * 0.18);
    const x = center + Math.cos(angle) * edgeRadius;
    const y = center + Math.sin(angle) * edgeRadius;
    ctx.fillStyle = i % 2 === 0 ? "#242424" : "#2b2b2b";
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 10; i += 1) {
    const px = (hash(i, diameter, 3) % 100) / 100;
    const py = (hash(i, diameter, 5) % 100) / 100;
    const x = center + (px * 2 - 1) * radius * 0.65;
    const y = center + (py * 2 - 1) * radius * 0.65;
    if (Math.hypot(x - center, y - center) > radius * 0.7) continue;
    ctx.fillStyle = i % 2 === 0 ? "#151515" : "#2a2a2a";
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = PIXI.Texture.from(canvas);
  texture.source.scaleMode = "nearest";
  return texture;
};

const fillRect = (
  graphics: PIXI.Graphics,
  color: number,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  graphics.fill(color).rect(x, y, width, height);
};

const buildTerrainGraphics = (
  graphics: PIXI.Graphics,
  size: number,
  cols: number,
  rows: number,
  pathTiles: Set<string>,
) => {
  const micro = 12;
  const pixel = size / micro;
  graphics.clear();

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const tileKey = `${col},${row}`;
      const tileX = col * size;
      const tileY = row * size;

      for (let py = 0; py < micro; py += 1) {
        for (let px = 0; px < micro; px += 1) {
          const grassRoll = hash(col * micro + px, row * micro + py, 1) % 100;
          let color = 0x78b935;
          if (grassRoll < 10) color = 0x6cab2f;
          else if (grassRoll < 20) color = 0x87c33f;
          else if (grassRoll < 30) color = 0x9ad54c;
          else if (grassRoll < 38) color = 0x5fa62a;
          fillRect(graphics, color, tileX + px * pixel, tileY + py * pixel, pixel, pixel);
        }
      }

      const feature = getTerrainFeatureAtTile(col, row, pathTiles);
      if (feature.type === "tree") {
        if (feature.variant === 0) {
          fillRect(graphics, 0x3a5c2b, tileX + pixel * 4, tileY + pixel * 7, pixel * 3, pixel * 3);
          fillRect(graphics, 0x4f7b36, tileX + pixel * 2, tileY + pixel * 3, pixel * 7, pixel * 5);
          fillRect(graphics, 0x6fa746, tileX + pixel * 3, tileY + pixel * 2, pixel * 5, pixel * 2);
          fillRect(graphics, 0x3b2b1b, tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 3);
        } else if (feature.variant === 1) {
          fillRect(graphics, 0x2f5a30, tileX + pixel * 5, tileY + pixel * 7, pixel * 2, pixel * 3);
          fillRect(graphics, 0x3f7b3f, tileX + pixel * 3, tileY + pixel * 3, pixel * 6, pixel * 5);
          fillRect(graphics, 0x5fa649, tileX + pixel * 4, tileY + pixel * 1, pixel * 4, pixel * 2);
          fillRect(graphics, 0x3b2b1b, tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 2);
        } else if (feature.variant === 2) {
          fillRect(graphics, 0x365b2a, tileX + pixel * 4, tileY + pixel * 6, pixel * 4, pixel * 4);
          fillRect(graphics, 0x4f7b36, tileX + pixel * 2, tileY + pixel * 3, pixel * 8, pixel * 4);
          fillRect(graphics, 0x6fa746, tileX + pixel * 3, tileY + pixel * 2, pixel * 6, pixel * 2);
          fillRect(graphics, 0x3b2b1b, tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 3);
        } else {
          fillRect(graphics, 0x2e532b, tileX + pixel * 5, tileY + pixel * 6, pixel * 2, pixel * 4);
          fillRect(graphics, 0x4a7536, tileX + pixel * 2, tileY + pixel * 4, pixel * 8, pixel * 4);
          fillRect(graphics, 0x6fa746, tileX + pixel * 3, tileY + pixel * 2, pixel * 6, pixel * 2);
          fillRect(graphics, 0x3b2b1b, tileX + pixel * 5, tileY + pixel * 9, pixel * 2, pixel * 2);
        }
      } else if (feature.type === "stump") {
        fillRect(graphics, 0xb58a55, tileX + pixel * 4, tileY + pixel * 7, pixel * 4, pixel * 3);
        fillRect(graphics, 0x906d44, tileX + pixel * 5, tileY + pixel * 8, pixel * 2, pixel);
      } else if (feature.type === "rock") {
        if (feature.variant === 0) {
          fillRect(graphics, 0x8c8a80, tileX + pixel * 2, tileY + pixel * 8, pixel * 3, pixel * 2);
          fillRect(graphics, 0x8c8a80, tileX + pixel * 7, tileY + pixel * 6, pixel * 2, pixel * 2);
          fillRect(graphics, 0xa7a39a, tileX + pixel * 3, tileY + pixel * 7, pixel, pixel);
        } else if (feature.variant === 1) {
          fillRect(graphics, 0x7f7b73, tileX + pixel * 5, tileY + pixel * 7, pixel * 3, pixel * 2);
          fillRect(graphics, 0x7f7b73, tileX + pixel * 2, tileY + pixel * 6, pixel * 2, pixel * 2);
          fillRect(graphics, 0xb6b1a6, tileX + pixel * 6, tileY + pixel * 6, pixel, pixel);
        } else if (feature.variant === 2) {
          fillRect(graphics, 0x8f8b82, tileX + pixel * 3, tileY + pixel * 7, pixel * 4, pixel * 2);
          fillRect(graphics, 0x8f8b82, tileX + pixel * 7, tileY + pixel * 5, pixel * 2, pixel * 2);
          fillRect(graphics, 0xbdb7ad, tileX + pixel * 4, tileY + pixel * 6, pixel, pixel);
        } else {
          fillRect(graphics, 0x8a867f, tileX + pixel * 2, tileY + pixel * 7, pixel * 2, pixel * 2);
          fillRect(graphics, 0x8a867f, tileX + pixel * 6, tileY + pixel * 7, pixel * 3, pixel * 2);
          fillRect(graphics, 0xb1aca2, tileX + pixel * 7, tileY + pixel * 6, pixel, pixel);
        }
      } else if (feature.type === "flower") {
        fillRect(graphics, 0xf0d86d, tileX + pixel * 2, tileY + pixel * 4, pixel, pixel);
        fillRect(graphics, 0xf0d86d, tileX + pixel * 8, tileY + pixel * 5, pixel, pixel);
        fillRect(graphics, 0xff8b7a, tileX + pixel * 5, tileY + pixel * 9, pixel, pixel);
      }

      if (pathTiles.has(tileKey)) {
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
            let dirtColor = 0xc9a26b;
            if (dirtRoll < 10) dirtColor = 0xcaa870;
            else if (dirtRoll < 20) dirtColor = 0xdfc18c;
            else if (dirtRoll < 30) dirtColor = 0xb88c58;
            fillRect(graphics, dirtColor, tileX + px * pixel, tileY + py * pixel, pixel, pixel);
          }
        }

        const pebbleRoll = hash(col, row, 6) % 100;
        if (pebbleRoll < 60) {
          fillRect(graphics, 0xe0d1b3, tileX + pixel * 2, tileY + pixel * 3, pixel, pixel);
          fillRect(graphics, 0xe0d1b3, tileX + pixel * 8, tileY + pixel * 6, pixel, pixel);
        }
        if (pebbleRoll < 30) {
          fillRect(graphics, 0x9a876c, tileX + pixel * 6, tileY + pixel * 2, pixel, pixel);
        }
      }
    }
  }
};

const createPixiRenderer = async (options: RendererOptions) => {
  const app = new PIXI.Application();
  await app.init({
    canvas: options.canvas,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    backgroundAlpha: 0,
    antialias: false,
  });

  const terrainLayer = new PIXI.Graphics();
  const towersLayer = new PIXI.Container();
  const starsLayer = new PIXI.Container();
  const enemiesLayer = new PIXI.Container();
  const healthBarsLayer = new PIXI.Container();
  const projectilesLayer = new PIXI.Container();
  const damageLayer = new PIXI.Container();
  const overlayLayer = new PIXI.Container();

  app.stage.addChild(
    terrainLayer,
    towersLayer,
    starsLayer,
    enemiesLayer,
    healthBarsLayer,
    projectilesLayer,
    damageLayer,
    overlayLayer,
  );

  const towerTextures = new Map<string, PIXI.Texture>();
  const enemyTextures = new Map<string, PIXI.Texture>();
  Object.entries(options.towerSprites).forEach(([key, sprite]) => {
    towerTextures.set(key, createSpriteTexture(sprite));
  });
  Object.entries(options.enemySprites).forEach(([factionId, sprites]) => {
    Object.entries(sprites).forEach(([type, sprite]) => {
      enemyTextures.set(`${factionId}:${type}`, createSpriteTexture(sprite));
    });
  });
  const rockTexture = createRockTexture();

  const towerSpritesById = new Map<string, PIXI.Sprite>();
  const starGraphicsById = new Map<string, PIXI.Graphics>();
  const enemySpritesById = new Map<string, PIXI.Sprite>();
  const healthBarsById = new Map<string, PIXI.Graphics>();
  const projectilePool: PIXI.Sprite[] = [];
  const damageTextPool: PIXI.Text[] = [];
  const overlayGraphics = new PIXI.Graphics();
  const overlayDragSprite = new PIXI.Sprite();

  overlayDragSprite.anchor.set(0.5);
  overlayDragSprite.visible = false;
  overlayLayer.addChild(overlayGraphics, overlayDragSprite);

  const resizeToCanvas = () => {
    const rect = options.canvas.getBoundingClientRect();
    app.renderer.resize(rect.width, rect.height);
  };

  const drawStar = (graphics: PIXI.Graphics, x: number, y: number, outerRadius: number, color: number) => {
    const innerRadius = outerRadius * 0.5;
    const points: number[] = [];
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
    graphics.poly(points).fill(color);
  };

  const updateTowers = (size: number, towers: Tower[]) => {
    const activeIds = new Set(towers.map((tower) => tower.id));
    for (const [id, sprite] of towerSpritesById.entries()) {
      if (!activeIds.has(id)) {
        towersLayer.removeChild(sprite);
        towerSpritesById.delete(id);
      }
    }
    for (const [id, starGraphic] of starGraphicsById.entries()) {
      if (!activeIds.has(id)) {
        starsLayer.removeChild(starGraphic);
        starGraphicsById.delete(id);
      }
    }
    for (const tower of towers) {
      let sprite = towerSpritesById.get(tower.id);
      if (!sprite) {
        const texture = towerTextures.get(tower.type.id) ?? PIXI.Texture.WHITE;
        sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        towersLayer.addChild(sprite);
        towerSpritesById.set(tower.id, sprite);
      }
      const center = tileCenter(tower.col, tower.row, size);
      const textureWidth = sprite.texture.width || 1;
      const scale = (size * 0.56) / textureWidth;
      sprite.scale.set(scale);
      sprite.position.set(center.x, center.y);

      const level = Math.min(tower.level, MAX_TOWER_LEVEL);
      if (level > 0) {
        let starGraphic = starGraphicsById.get(tower.id);
        if (!starGraphic) {
          starGraphic = new PIXI.Graphics();
          starsLayer.addChild(starGraphic);
          starGraphicsById.set(tower.id, starGraphic);
        }
        starGraphic.clear();
        const baseY = center.y - size * 0.48;
        if (level === MAX_TOWER_LEVEL) {
          drawStar(starGraphic, center.x, baseY, size * 0.16, 0xe66ca7);
        } else {
          const starColor = 0xf2c14f;
          const offset = size * 0.14;
          drawStar(starGraphic, center.x - (level > 1 ? offset : 0), baseY, size * 0.11, starColor);
          if (level > 1) {
            drawStar(starGraphic, center.x + offset, baseY, size * 0.11, starColor);
          }
        }
      } else {
        const starGraphic = starGraphicsById.get(tower.id);
        if (starGraphic) {
          starGraphic.clear();
        }
      }
    }
  };

  const updateEnemies = (size: number, enemies: Enemy[]) => {
    const activeIds = new Set(enemies.map((enemy) => enemy.id));
    for (const [id, sprite] of enemySpritesById.entries()) {
      if (!activeIds.has(id)) {
        enemiesLayer.removeChild(sprite);
        enemySpritesById.delete(id);
      }
    }
    for (const [id, bar] of healthBarsById.entries()) {
      if (!activeIds.has(id)) {
        healthBarsLayer.removeChild(bar);
        healthBarsById.delete(id);
      }
    }
    for (const enemy of enemies) {
      if (enemy.x === undefined || enemy.y === undefined) continue;
      let sprite = enemySpritesById.get(enemy.id);
      if (!sprite) {
        const textureKey = `${enemy.faction}:${enemy.type}`;
        const texture =
          enemyTextures.get(textureKey) ?? enemyTextures.get(`${enemy.faction}:raider`) ?? PIXI.Texture.WHITE;
        sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        enemiesLayer.addChild(sprite);
        enemySpritesById.set(enemy.id, sprite);
      }
      const textureWidth = sprite.texture.width || 1;
      const sizeScale = enemy.sizeScale ?? 1;
      const scale = (size * 0.5 * sizeScale) / textureWidth;
      sprite.scale.set(scale);
      sprite.position.set(enemy.x, enemy.y);

      let bar = healthBarsById.get(enemy.id);
      if (!bar) {
        bar = new PIXI.Graphics();
        healthBarsLayer.addChild(bar);
        healthBarsById.set(enemy.id, bar);
      }
      const maxHp = enemy.maxHp || 1;
      const hpRatio = Math.max(0, Math.min(1, enemy.hp / maxHp));
      const barWidth = size * 0.6 * sizeScale;
      const barHeight = Math.max(2, size * 0.08);
      const barX = enemy.x - barWidth / 2;
      const barY = enemy.y - size * 0.55 * sizeScale;
      bar.clear();
      bar.rect(barX, barY, barWidth, barHeight).fill(0x2a1b18);
      if (hpRatio > 0) {
        bar.rect(barX, barY, barWidth * hpRatio, barHeight).fill(0x6fd36f);
      }
    }
  };

  const updateProjectiles = (size: number, projectiles: Projectile[]) => {
    while (projectilePool.length < projectiles.length) {
      const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      projectilesLayer.addChild(sprite);
      projectilePool.push(sprite);
    }

    projectiles.forEach((bolt, index) => {
      const sprite = projectilePool[index];
      sprite.visible = true;
      const isCatapult = bolt.towerTypeId === TOWER_IDS.catapult;
      sprite.texture = isCatapult ? rockTexture : PIXI.Texture.WHITE;
      sprite.tint = isCatapult ? 0xffffff : hexToNumber(bolt.color);
      let sizePx = 3;
      if (isCatapult) {
        const targetX = bolt.targetX ?? bolt.x;
        const targetY = bolt.targetY ?? bolt.y;
        const totalDist = Math.hypot(targetX - bolt.originX, targetY - bolt.originY);
        const remaining = Math.hypot(targetX - bolt.x, targetY - bolt.y);
        const progress = totalDist > 0 ? 1 - remaining / totalDist : 1;
        const tri = 1 - Math.abs(progress * 2 - 1);
        const base = Math.max(5, size * 0.16);
        sizePx = base * (1 + tri * 2.0);
      }
      sprite.width = sizePx;
      sprite.height = sizePx;
      sprite.position.set(bolt.x - sizePx * 0.5, bolt.y - sizePx * 0.5);
    });

    for (let i = projectiles.length; i < projectilePool.length; i += 1) {
      projectilePool[i].visible = false;
    }
  };

  const updateDamagePopups = (
    size: number,
    popups: Array<{ x: number; y: number; value: number; time: number; duration: number }>,
  ) => {
    while (damageTextPool.length < popups.length) {
      const text = new PIXI.Text({
        text: "",
        style: {
          fontSize: 10,
          fill: "#1b1b1b",
          fontWeight: "600",
        },
      });
      text.anchor.set(0.5);
      damageLayer.addChild(text);
      damageTextPool.push(text);
    }

    popups.forEach((popup, index) => {
      const text = damageTextPool[index];
      const progress = popup.duration > 0 ? Math.min(1, popup.time / popup.duration) : 1;
      const rise = size * 0.35 * progress;
      text.visible = true;
      text.text = `${popup.value}`;
      if (popup.color) {
        text.style.fill = popup.color;
      } else {
        text.style.fill = "#1b1b1b";
      }
      text.alpha = 0.7 * (1 - progress);
      text.style.fontSize = Math.max(10, size * 0.26);
      text.position.set(popup.x, popup.y - rise);
    });

    for (let i = popups.length; i < damageTextPool.length; i += 1) {
      damageTextPool[i].visible = false;
    }
  };

  const updateOverlay = (frame: FrameData) => {
    overlayGraphics.clear();
    overlayDragSprite.visible = false;
    if (frame.effects.length > 0) {
      for (const effect of frame.effects) {
        const progress = Math.min(1, Math.max(0, effect.time / effect.duration));
        const alpha = 0.7 * (1 - progress);
        const radius = effect.radius * (0.6 + progress * 0.6);
        overlayGraphics
          .circle(effect.x, effect.y, radius)
          .stroke({ width: Math.max(1, frame.size * 0.03), color: 0x2b1f14, alpha });
      }
    }
    if (frame.targetIndicator) {
      const strokeWidth = Math.max(1.5, frame.size * 0.05);
      const arm = frame.size * 0.25;
      const alpha = frame.targetIndicator.alpha ?? 0.9;
      overlayGraphics
        .moveTo(frame.targetIndicator.x - arm, frame.targetIndicator.y)
        .lineTo(frame.targetIndicator.x + arm, frame.targetIndicator.y)
        .moveTo(frame.targetIndicator.x, frame.targetIndicator.y - arm)
        .lineTo(frame.targetIndicator.x, frame.targetIndicator.y + arm)
        .stroke({ width: strokeWidth, color: 0xff3b30, alpha });
      overlayGraphics
        .circle(frame.targetIndicator.x, frame.targetIndicator.y, frame.size * 0.18)
        .stroke({ width: Math.max(1, frame.size * 0.03), color: 0xff3b30, alpha: alpha * 0.8 });
    }
    if (frame.highlightedTowerId && frame.highlightAlpha > 0) {
      const tower = frame.towers.find((item) => item.id === frame.highlightedTowerId);
      if (tower) {
        const center = tileCenter(tower.col, tower.row, frame.size);
        const strokeWidth = Math.max(1.5, frame.size * 0.04);
        const stats = getTowerStats(tower);
        overlayGraphics
          .circle(center.x, center.y, stats.range * frame.size)
          .stroke({ width: strokeWidth, color: 0xffffff, alpha: 0.45 * frame.highlightAlpha });
      }
    }
    if (frame.dragPreview) {
      const strokeWidth = Math.max(1.5, frame.size * 0.04);
      overlayGraphics
        .circle(frame.dragPreview.x, frame.dragPreview.y, frame.dragPreview.range * frame.size)
        .stroke({ width: strokeWidth, color: 0xffffff, alpha: 0.55 });
      const texture = frame.dragPreview.spriteId
        ? towerTextures.get(frame.dragPreview.spriteId) ?? PIXI.Texture.WHITE
        : PIXI.Texture.WHITE;
      const scale = frame.dragPreview.spriteId
        ? (frame.size * 0.56) / (texture.width || 1)
        : (frame.size * 0.28) / (texture.width || 1);
      overlayDragSprite.texture = texture;
      overlayDragSprite.scale.set(scale);
      overlayDragSprite.tint = frame.dragPreview.spriteId ? 0xffffff : hexToNumber(frame.dragPreview.color);
      overlayDragSprite.position.set(frame.dragPreview.x, frame.dragPreview.y);
      overlayDragSprite.visible = true;
    }
  };

  const updateFrame = (frame: FrameData) => {
    updateTowers(frame.size, frame.towers);
    updateEnemies(frame.size, frame.enemies);
    updateProjectiles(frame.size, frame.projectiles);
    updateDamagePopups(frame.size, frame.damagePopups);
    updateOverlay(frame);
  };

  const rebuildTerrain = (size: number, cols: number, rows: number) => {
    buildTerrainGraphics(terrainLayer, size, cols, rows, options.pathTiles);
  };

  return { app, updateFrame, rebuildTerrain, resizeToCanvas };
};

export { createPixiRenderer };
