import type { PixelSprite } from "../../../types/core/types";

const wizardSprite: PixelSprite = {
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
      H: "#4c2a6b",
      h: "#6a3f8e",
      B: "#2f5f9e",
      b: "#1d3a66",
      e: "#f2d47a",
      s: "#b08555",
      S: "#6b4a2c",
    },
  };

export { wizardSprite };
