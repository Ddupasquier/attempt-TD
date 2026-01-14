import type { PixelSprite } from "../../../types/core/types";

const fighterSprite: PixelSprite = {
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
      R: "#566072",
      r: "#78839a",
      W: "#c7c0b5",
      w: "#9f968a",
      s: "#6d4b2c",
    },
  };

export { fighterSprite };
