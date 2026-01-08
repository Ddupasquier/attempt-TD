import type { GameState, TowerType } from "../core/types";

export type HudElements = {
  statsEl: HTMLDivElement;
  towerListEl: HTMLDivElement;
  startWaveBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  toggleSoundBtn: HTMLButtonElement;
  defeatModal: HTMLDivElement;
  defeatReset: HTMLButtonElement;
  factionLabel: HTMLDivElement;
};

export function updateStats(statsEl: HTMLDivElement, state: GameState) {
  statsEl.innerHTML = `Gold: ${state.gold} | Lives: ${state.lives} | Wave: ${state.wave}`;
}

export function updateSoundButton(toggleSoundBtn: HTMLButtonElement, soundEnabled: boolean) {
  toggleSoundBtn.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
}

export function updateWaveButton(
  startWaveBtn: HTMLButtonElement,
  isCountingDown: boolean,
  countdownRemaining: number,
) {
  if (isCountingDown) {
    startWaveBtn.disabled = true;
    const seconds = Math.ceil(countdownRemaining);
    startWaveBtn.textContent = `Next wave (${Math.max(seconds, 1)})`;
  } else {
    startWaveBtn.disabled = false;
    startWaveBtn.textContent = "Start Wave";
  }
}

export function updateFactionLabel(factionLabel: HTMLDivElement, factionName: string) {
  factionLabel.textContent = `Enemy Faction: ${factionName}`;
}

export function showDefeatModal(defeatModal: HTMLDivElement) {
  defeatModal.classList.add("open");
  defeatModal.setAttribute("aria-hidden", "false");
}

export function hideDefeatModal(defeatModal: HTMLDivElement) {
  defeatModal.classList.remove("open");
  defeatModal.setAttribute("aria-hidden", "true");
}

export function buildTowerList(
  towerListEl: HTMLDivElement,
  towerTypes: TowerType[],
  onSelect: (towerTypeId: string) => void,
) {
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
}

export function setSelectedTowerCard(towerListEl: HTMLDivElement, towerId: string) {
  for (const card of towerListEl.querySelectorAll<HTMLDivElement>(".tower-card")) {
    card.classList.toggle("active", card.dataset.towerId === towerId);
  }
}
