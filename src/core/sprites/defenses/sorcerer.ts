import type { PixelSprite } from "../../../types/core/types";

const sorcererSprite: PixelSprite = {
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
      H: "#8a2f2f",
      h: "#d05a3a",
      B: "#4a2a2a",
      b: "#3a1f1f",
      e: "#f2d47a",
      s: "#b08555",
      S: "#6b4a2c",
    },
  };

export { sorcererSprite };
