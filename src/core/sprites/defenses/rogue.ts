import type { PixelSprite } from "../../../types/core/types";

const rogueSprite: PixelSprite = {
    pixels: [
      "....xx......",
      "...xRRx.....",
      "..xRRRRx....",
      ".xRRrRRRx...",
      ".xRRRRRRx...",
      "..xRRRRx....",
      "..xWWwwWx...",
      ".xWWWWWwx...",
      ".xWWwwWwx...",
      "xWWWWWWWWs.",
      "xWWWwWWxxs.",
      ".xWWWWWxxs.",
    ],
    colors: {
      x: "#1a1a1a",
      R: "#4f5564",
      r: "#6a7386",
      W: "#c7c0b5",
      w: "#9f968a",
      s: "#5a4326",
    },
  };

export { rogueSprite };
