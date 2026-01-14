<script lang="ts">
  import ActionsBar from "./components/ActionsBar.svelte";
  import DefeatModal from "./components/DefeatModal.svelte";
  import HudOverlay from "./components/HudOverlay.svelte";
  import ResetConfirmModal from "./components/ResetConfirmModal.svelte";
  import DefenseUpgradePopup from "./components/DefenseUpgradePopup.svelte";
  import type { UiRootProps } from "../types/ui/UiRoot.types";

  const {
    uiState,
    defenseTypes,
    defenseSprites,
    spellScrollTypes,
    spellScrollSprites,
    onStartWave,
    onResetGame,
    onToggleSound,
    onToggleAutoWave,
    onToggleDamagePopups,
    onToggleSpeed,
    onSelectDefense,
    onStartDragDefense,
    onStartDragSpellScroll,
    onUpgradeDefense,
    onDeleteDefense,
    onSetDefenseTarget,
    onCloseDefensePopup,
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
    showDamagePopups={$uiState.showDamagePopups}
    speedMultiplier={$uiState.speedMultiplier}
    onStartWave={onStartWave}
    onResetGame={handleOpenResetConfirm}
    onToggleSound={onToggleSound}
    onToggleAutoWave={onToggleAutoWave}
    onToggleDamagePopups={onToggleDamagePopups}
    onToggleSpeed={onToggleSpeed}
  />
  <HudOverlay
    {defenseTypes}
    {defenseSprites}
    {spellScrollTypes}
    {spellScrollSprites}
    spellScrollCooldowns={$uiState.spellScrollCooldowns}
    selectedDefenseTypeId={$uiState.selectedDefenseTypeId}
    gold={$uiState.gold}
    hp={$uiState.hp}
    wave={$uiState.wave}
    foeFactionName={$uiState.foeFactionName}
    isCollapsed={isHudCollapsed}
    onToggle={handleToggleHud}
    onSelectDefense={onSelectDefense}
    onStartDragDefense={onStartDragDefense}
    onStartDragSpellScroll={onStartDragSpellScroll}
  />
  {#if $uiState.selectedDefensePopup}
    <DefenseUpgradePopup
      popup={$uiState.selectedDefensePopup}
      boundsWidth={$uiState.mapWidth}
      boundsHeight={$uiState.mapHeight}
      onUpgrade={onUpgradeDefense}
      onDelete={onDeleteDefense}
      onSetTarget={onSetDefenseTarget}
      onClose={onCloseDefensePopup}
    />
  {/if}
  <ResetConfirmModal
    isOpen={isResetConfirmOpen}
    onConfirm={handleConfirmReset}
    onCancel={handleCancelReset}
  />
  <DefeatModal isOpen={$uiState.showDefeat} onReset={onDefeatReset} />
</div>
