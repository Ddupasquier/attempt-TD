import type { GameState, TowerType } from "../core/types";

type HudElements = {
  statsEl: HTMLDivElement;
  towerListEl: HTMLDivElement;
  startWaveBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  toggleSoundBtn: HTMLButtonElement;
  defeatModal: HTMLDivElement;
  defeatReset: HTMLButtonElement;
  factionLabel: HTMLDivElement;
};

const updateStats = (statsEl: HTMLDivElement, state: GameState) => {
  statsEl.innerHTML = `Gold: ${state.gold} | Lives: ${state.lives} | Wave: ${state.wave}`;
};

const updateSoundButton = (toggleSoundBtn: HTMLButtonElement, soundEnabled: boolean) => {
  toggleSoundBtn.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
};

const updateWaveButton = (
  startWaveBtn: HTMLButtonElement,
  isCountingDown: boolean,
  countdownRemaining: number,
) => {
  if (isCountingDown) {
    startWaveBtn.disabled = true;
    const seconds = Math.ceil(countdownRemaining);
    startWaveBtn.textContent = `Next wave (${Math.max(seconds, 1)})`;
  } else {
    startWaveBtn.disabled = false;
    startWaveBtn.textContent = "Start Wave";
  }
};

const updateFactionLabel = (factionLabel: HTMLDivElement, factionName: string) => {
  factionLabel.textContent = `Enemy Faction: ${factionName}`;
};

const showDefeatModal = (defeatModal: HTMLDivElement) => {
  defeatModal.classList.add("open");
  defeatModal.setAttribute("aria-hidden", "false");
};

const hideDefeatModal = (defeatModal: HTMLDivElement) => {
  defeatModal.classList.remove("open");
  defeatModal.setAttribute("aria-hidden", "true");
};

const drawTowerCardSprite = (
  canvas: HTMLCanvasElement,
  sprite: { pixels: string[]; colors: Record<string, string> },
) => {
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

const buildTowerList = (
  towerListEl: HTMLDivElement,
  towerTypes: TowerType[],
  towerSprites: Record<string, { pixels: string[]; colors: Record<string, string> }>,
  onSelect: (towerTypeId: string) => void,
  onDragStart: (towerTypeId: string) => void,
) => {
  towerListEl.innerHTML = "";
  for (const tower of towerTypes) {
    const card = document.createElement("div");
    card.className = "tower-card";
    card.dataset.towerId = tower.id;
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 36;
    spriteCanvas.height = 36;
    spriteCanvas.className = "tower-sprite";
    const sprite = towerSprites[tower.id];
    if (sprite) {
      drawTowerCardSprite(spriteCanvas, sprite);
    }
    card.innerHTML = `
      <div class="tower-card__content">
        <h4>${tower.name}</h4>
        <div class="tower-card__types">${tower.types.join(" • ")}</div>
        <p>${tower.description} <span class="tower-card__cost">(${tower.cost}g)</span></p>
      </div>
    `;
    card.prepend(spriteCanvas);
    card.addEventListener("click", () => onSelect(tower.id));
    card.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      onDragStart(tower.id);
    });
    towerListEl.appendChild(card);
  }
};

const setSelectedTowerCard = (towerListEl: HTMLDivElement, towerId: string) => {
  for (const card of towerListEl.querySelectorAll<HTMLDivElement>(".tower-card")) {
    card.classList.toggle("active", card.dataset.towerId === towerId);
  }
};

export type { HudElements };
export {
  buildTowerList,
  hideDefeatModal,
  setSelectedTowerCard,
  showDefeatModal,
  updateFactionLabel,
  updateSoundButton,
  updateStats,
  updateWaveButton,
};
