import type { PixelSprite } from "../../../types/core/types";

const militiaSprite: PixelSprite = {
    pixels: [
      "....xx......",
      "...xSSx.....",
      "..xSSSSx....",
      "..xMMMSx....",
      ".xMMMMMx...",
      ".xMMmMMx...",
      "..xMMMMx...",
      "..xWMMWx...",
      ".xWWWWWx...",
      "xWWWWWWWWs.",
      "xWWWwWWxxs.",
      ".xWWWWWxxs.",
    ],
    colors: {
      x: "#1a1a1a",
      S: "#9b9b9b",
      M: "#8a7b5a",
      m: "#6b5e44",
      W: "#c7c0b5",
      w: "#9f968a",
      s: "#5a4326",
    },
  };

export { militiaSprite };
