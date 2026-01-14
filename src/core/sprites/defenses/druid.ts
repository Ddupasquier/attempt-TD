import type { PixelSprite } from "../../../types/core/types";

const druidSprite: PixelSprite = {
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
      H: "#3e6b3f",
      h: "#5a8c55",
      B: "#2c4a32",
      b: "#223a27",
      e: "#c4b874",
      s: "#7a5a33",
      S: "#5a4326",
    },
  };

export { druidSprite };
