<script lang="ts">
  import ActionsBar from "./components/ActionsBar.svelte";
  import DefeatModal from "./components/DefeatModal.svelte";
  import HudOverlay from "./components/HudOverlay.svelte";
  import type { PixelSprite, TowerType } from "../core/types";
  import type { UiState } from "./uiState";
  import type { Writable } from "svelte/store";

  type UiRootProps = {
    uiState: Writable<UiState>;
    towerTypes: TowerType[];
    towerSprites: Record<string, PixelSprite>;
    onStartWave: () => void;
    onResetGame: () => void;
    onToggleSound: () => void;
    onSelectTower: (towerId: string | null) => void;
    onStartDragTower: (towerId: string) => void;
    onDefeatReset: () => void;
  };

  const {
    uiState,
    towerTypes,
    towerSprites,
    onStartWave,
    onResetGame,
    onToggleSound,
    onSelectTower,
    onStartDragTower,
    onDefeatReset,
  } = $props<UiRootProps>();

  let isHudCollapsed = $state(true);

  const handleToggleHud = () => {
    isHudCollapsed = !isHudCollapsed;
  };
</script>

<div class="ui-layer" class:is-dragging={$uiState.isDragging}>
  <ActionsBar
    isCountingDown={$uiState.isCountingDown}
    countdownRemaining={$uiState.countdownRemaining}
    soundEnabled={$uiState.soundEnabled}
    onStartWave={onStartWave}
    onResetGame={onResetGame}
    onToggleSound={onToggleSound}
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
  <DefeatModal isOpen={$uiState.showDefeat} onReset={onDefeatReset} />
</div>
