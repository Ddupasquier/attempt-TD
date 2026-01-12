<script lang="ts">
  import { UI_TEXT } from "../text";
  import TowerCard from "./TowerCard.svelte";
  import type { HudOverlayProps } from "../../types/ui/components/HudOverlay.types";

  const {
    towerTypes,
    towerSprites,
    selectedTowerTypeId,
    gold,
    lives,
    wave,
    enemyFactionName,
    isCollapsed,
    onToggle,
    onSelectTower,
    onStartDragTower,
  } = $props<HudOverlayProps>();

  const toggleLabel = $derived(isCollapsed ? UI_TEXT.hudFabLabel : UI_TEXT.hudToggleHide);
</script>

<div class="hud-overlay">
  <div class="hud-header">
    <div class="title">{UI_TEXT.appTitle}</div>
    <div class="stats">{UI_TEXT.stats(gold, lives, wave)}</div>
    <button class="hud-toggle" type="button" onclick={onToggle}>{toggleLabel}</button>
  </div>
  <div class="hud hud-body" class:is-collapsed={isCollapsed}>
    <div class="hud-section">
      <div class="label">{UI_TEXT.towerLabel}</div>
      <div class="tower-hint">{UI_TEXT.hintTowerSelect}</div>
      <div class="tower-list">
        {#each towerTypes as tower (tower.id)}
          <TowerCard
            tower={tower}
            sprite={towerSprites[tower.id]}
            isActive={selectedTowerTypeId === tower.id}
            onSelect={onSelectTower}
            onStartDrag={onStartDragTower}
          />
        {/each}
      </div>
    </div>
    <div class="hud-section">
      <div class="label">{UI_TEXT.factionsLabel}</div>
      <div class="factions">{UI_TEXT.enemyFaction(enemyFactionName)}</div>
    </div>
  </div>
  <div class="hint hud-hint" class:is-collapsed={isCollapsed}>{UI_TEXT.hintDrag}</div>
</div>
