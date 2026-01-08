import type { PixelSprite } from "../core/types";

const drawTowerCardSprite = (canvas: HTMLCanvasElement, sprite: PixelSprite) => {
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

const spriteCanvas = (node: HTMLCanvasElement, sprite: PixelSprite | null) => {
  if (sprite) {
    drawTowerCardSprite(node, sprite);
  }
  return {
    update(nextSprite: PixelSprite | null) {
      if (nextSprite) {
        drawTowerCardSprite(node, nextSprite);
      }
    },
  };
};

export { spriteCanvas };
