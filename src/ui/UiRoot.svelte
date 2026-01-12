<script lang="ts">
  import ActionsBar from "./components/ActionsBar.svelte";
  import DefeatModal from "./components/DefeatModal.svelte";
  import HudOverlay from "./components/HudOverlay.svelte";
  import ResetConfirmModal from "./components/ResetConfirmModal.svelte";
  import TowerUpgradePopup from "./components/TowerUpgradePopup.svelte";
  import type { UiRootProps } from "../types/ui/UiRoot.types";

  const {
    uiState,
    towerTypes,
    towerSprites,
    onStartWave,
    onResetGame,
    onToggleSound,
    onToggleAutoWave,
    onToggleSpeed,
    onSelectTower,
    onStartDragTower,
    onUpgradeTower,
    onCloseTowerPopup,
    onDefeatReset,
  } = $props<UiRootProps>();

  let isHudCollapsed = $state(true);
  let isResetConfirmOpen = $state(false);

  const handleToggleHud = () => {
    isHudCollapsed = !isHudCollapsed;
  };

  const handleOpenResetConfirm = () => {
    isResetConfirmOpen = true;
  };

  const handleConfirmReset = () => {
    isResetConfirmOpen = false;
    onResetGame();
  };

  const handleCancelReset = () => {
    isResetConfirmOpen = false;
  };
</script>

<div class="ui-layer" class:is-dragging={$uiState.isDragging}>
  <ActionsBar
    isCountingDown={$uiState.isCountingDown}
    countdownRemaining={$uiState.countdownRemaining}
    soundEnabled={$uiState.soundEnabled}
    autoWaveEnabled={$uiState.autoWaveEnabled}
    speedMultiplier={$uiState.speedMultiplier}
    onStartWave={onStartWave}
    onResetGame={handleOpenResetConfirm}
    onToggleSound={onToggleSound}
    onToggleAutoWave={onToggleAutoWave}
    onToggleSpeed={onToggleSpeed}
  />
  <HudOverlay
    {towerTypes}
    {towerSprites}
    selectedTowerTypeId={$uiState.selectedTowerTypeId}
    gold={$uiState.gold}
    lives={$uiState.lives}
    wave={$uiState.wave}
    enemyFactionName={$uiState.enemyFactionName}
    isCollapsed={isHudCollapsed}
    onToggle={handleToggleHud}
    onSelectTower={onSelectTower}
    onStartDragTower={onStartDragTower}
  />
  {#if $uiState.selectedTowerPopup}
    <TowerUpgradePopup
      popup={$uiState.selectedTowerPopup}
      onUpgrade={onUpgradeTower}
      onClose={onCloseTowerPopup}
    />
  {/if}
  <ResetConfirmModal
    isOpen={isResetConfirmOpen}
    onConfirm={handleConfirmReset}
    onCancel={handleCancelReset}
  />
  <DefeatModal isOpen={$uiState.showDefeat} onReset={onDefeatReset} />
</div>
