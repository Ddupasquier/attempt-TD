import type { PixelSprite } from "../types/core/types";
import type { UiSprite } from "../types/ui/uiSpriteTypes";

const drawDefenseCardSprite = (canvas: HTMLCanvasElement, sprite: PixelSprite) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = sprite.pixels[0]?.length ?? 8;
  const height = sprite.pixels.length;
  const pixelSize = Math.floor(Math.min(canvas.width / width, canvas.height / height));
  const offsetX = Math.floor((canvas.width - width * pixelSize) / 2);
  const offsetY = Math.floor((canvas.height - height * pixelSize) / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < height; row += 1) {
    const line = sprite.pixels[row];
    for (let col = 0; col < width; col += 1) {
      const key = line[col];
      if (key === "." || !key) continue;
      const color = sprite.colors[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + col * pixelSize, offsetY + row * pixelSize, pixelSize, pixelSize);
    }
  }
};

const imageCache = new Map<string, HTMLImageElement>();

const drawImageSprite = (canvas: HTMLCanvasElement, imageSrc: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let image = imageCache.get(imageSrc);
  if (!image) {
    image = new Image();
    image.src = imageSrc;
    imageCache.set(imageSrc, image);
  }
  if (!image.complete) {
    image.onload = () => drawImageSprite(canvas, imageSrc);
    return;
  }
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
  const drawWidth = Math.floor(image.width * scale);
  const drawHeight = Math.floor(image.height * scale);
  const offsetX = Math.floor((canvas.width - drawWidth) / 2);
  const offsetY = Math.floor((canvas.height - drawHeight) / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};

const spriteCanvas = (node: HTMLCanvasElement, sprite: UiSprite | null) => {
  if (sprite) {
    if ("imageSrc" in sprite) {
      drawImageSprite(node, sprite.imageSrc);
    } else {
      drawDefenseCardSprite(node, sprite);
    }
  }
  return {
    update(nextSprite: UiSprite | null) {
      if (!nextSprite) return;
      if ("imageSrc" in nextSprite) {
        drawImageSprite(node, nextSprite.imageSrc);
      } else {
        drawDefenseCardSprite(node, nextSprite);
      }
    },
  };
};

export { spriteCanvas };
