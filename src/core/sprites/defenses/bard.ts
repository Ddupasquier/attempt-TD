import type { PixelSprite } from "../../../types/core/types";

const bardSprite: PixelSprite = {
    pixels: [
      "....xx......",
      "...xxxx.....",
      "..xHhhHx....",
      ".xHHhHHHx...",
      ".xHHHHHHx...",
      "..xHHHHx....",
      "..xBBeeBx...",
      ".xBBBBBbx.s.",
      ".xBBBBbbx.s.",
      "xBBBBBBBBx.s",
      "xBBBBbBBxxS.",
      ".xBBBBBBxxS.",
    ],
    colors: {
      x: "#1a1a1a",
      H: "#7b3f8e",
      h: "#a161c2",
      B: "#3a4f8c",
      b: "#2b3a66",
      e: "#f2d47a",
      s: "#b08555",
      S: "#6b4a2c",
    },
  };

export { bardSprite };
