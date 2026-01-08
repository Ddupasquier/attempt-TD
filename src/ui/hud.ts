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

const buildTowerList = (
  towerListEl: HTMLDivElement,
  towerTypes: TowerType[],
  onSelect: (towerTypeId: string) => void,
) => {
  towerListEl.innerHTML = "";
  for (const tower of towerTypes) {
    const card = document.createElement("div");
    card.className = "tower-card";
    card.dataset.towerId = tower.id;
    card.innerHTML = `
      <h4>${tower.name}</h4>
      <p>${tower.description} (${tower.cost}g)</p>
    `;
    card.addEventListener("click", () => onSelect(tower.id));
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
