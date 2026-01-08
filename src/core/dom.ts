const requireElement = <T extends HTMLElement>(id: string) => {
  const element = document.getElementById(id) as T | null;
  if (!element) {
    throw new Error(`Element not found: ${id}`);
  }
  return element;
};

const getCanvasContext = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D context not available");
  }
  return ctx;
};

export { getCanvasContext, requireElement };
