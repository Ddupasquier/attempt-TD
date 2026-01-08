const UI_TEXT = {
  pageTitle: "Fantasy TD - Prototype",
  appTitle: "Fantasy TD (Prototype)",
  hudToggleHide: "Hide",
  hudFabLabel: "Menu",
  towerLabel: "Tower",
  factionsLabel: "Factions",
  hintDrag: "Drag a tile to place a tower.",
  hintTowerSelect: "Click a tower to view details.",
  defeatTitle: "Defeat",
  defeatMessage: "Your defenses fell. Want to try again?",
  defeatReset: "Reset Game",
  startWaveAria: "Start wave",
  startWaveLabel: "Start Wave",
  resetAria: "Reset game",
  soundOnAria: "Sound on",
  soundOffAria: "Sound off",
  stats: (gold: number, lives: number, wave: number) => `Gold: ${gold} | Lives: ${lives} | Wave: ${wave}`,
  enemyFaction: (name: string) => `Enemy Faction: ${name}`,
  nextWave: (seconds: number) => `Next wave (${seconds})`,
};

export { UI_TEXT };
