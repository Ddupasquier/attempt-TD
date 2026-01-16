<script lang="ts">
  import { UI_TEXT } from "../text";
  import DefenseCard from "./DefenseCard.svelte";
  import SpellScrollCard from "./SpellScrollCard.svelte";
  import type { HudOverlayProps } from "../../types/ui/components/HudOverlay.types";

  const {
    defenseTypes,
    defenseSprites,
    spellScrollTypes,
    spellScrollSprites,
    spellScrollCooldowns,
    defenseCounts,
    selectedDefenseTypeId,
    gold,
    hp,
    wave,
    foeFactionName,
    isCollapsed,
    onToggle,
    onSelectDefense,
    onStartDragDefense,
    onStartDragSpellScroll,
  } = $props<HudOverlayProps>();

  const toggleLabel = $derived(isCollapsed ? UI_TEXT.hudFabLabel : UI_TEXT.hudToggleHide);
  const getDefenseCost = (defenseId: string, baseCost: number) => {
    const placed = defenseCounts[defenseId] ?? 0;
    return baseCost + placed * 5;
  };
  const sortedDefenses = $derived(
    [...defenseTypes].sort(
      (a, b) => getDefenseCost(a.id, a.cost) - getDefenseCost(b.id, b.cost),
    ),
  );
  const sortedSpellScrolls = $derived(
    [...spellScrollTypes].sort((a, b) => a.cost - b.cost),
  );
  let selectedSpellScrollTypeId = $state<string | null>(null);

  const handleSelectSpellScroll = (spellScrollId: string | null) => {
    selectedSpellScrollTypeId = spellScrollId;
  };

  const selectedDefense = $derived(
    selectedDefenseTypeId ? defenseTypes.find((defense) => defense.id === selectedDefenseTypeId) : null,
  );
  const selectedSpellScroll = $derived(
    selectedSpellScrollTypeId
      ? spellScrollTypes.find((scroll) => scroll.id === selectedSpellScrollTypeId)
      : null,
  );
</script>

<div class="hud-overlay">
  <div class="hud-header">
    <div class="title">{UI_TEXT.appTitle}</div>
    <div class="stats">{UI_TEXT.stats(gold, hp, wave)}</div>
    <button class="hud-toggle" type="button" onclick={onToggle}>{toggleLabel}</button>
  </div>
  <div class="hud hud-body" class:is-collapsed={isCollapsed}>
    <div class="hud-section">
      <div class="label">{UI_TEXT.towerLabel}</div>
      <div class="defense-hint">{UI_TEXT.hintTowerSelect}</div>
      {#if selectedDefense}
        <div class="hud-selection-panel">
          <div class="hud-selection-panel__content">
            <div class="hud-selection-panel__title-row">
              <div class="hud-selection-panel__name">{selectedDefense.name}</div>
              <div class="hud-selection-panel__cost">({getDefenseCost(selectedDefense.id, selectedDefense.cost)}g)</div>
            </div>
            <div class="hud-selection-panel__types">{selectedDefense.types.join(" • ")}</div>
            <p class="hud-selection-panel__desc">{selectedDefense.description}</p>
          </div>
        </div>
      {/if}
      <div class="defense-list">
        {#each sortedDefenses as defense (defense.id)}
          <DefenseCard
            defense={defense}
            sprite={defenseSprites[defense.id]}
            isActive={selectedDefenseTypeId === defense.id}
            cost={getDefenseCost(defense.id, defense.cost)}
            canAfford={gold >= getDefenseCost(defense.id, defense.cost)}
            onSelect={onSelectDefense}
            onStartDrag={onStartDragDefense}
          />
        {/each}
      </div>
    </div>
    <div class="hud-section">
      <div class="label">{UI_TEXT.trapLabel}</div>
      <div class="spell-scroll-hint">{UI_TEXT.hintTrapDrag}</div>
      {#if selectedSpellScroll}
        <div class="hud-selection-panel">
          <div class="hud-selection-panel__content">
            <div class="hud-selection-panel__title-row">
              <div class="hud-selection-panel__name">{selectedSpellScroll.name}</div>
              <div class="hud-selection-panel__cost">({selectedSpellScroll.cost}g)</div>
            </div>
            <div class="hud-selection-panel__types">{selectedSpellScroll.types.join(" • ")}</div>
            <p class="hud-selection-panel__desc">{selectedSpellScroll.description}</p>
          </div>
        </div>
      {/if}
      <div class="spell-scroll-list">
        {#each sortedSpellScrolls as spellScroll (spellScroll.id)}
          <SpellScrollCard
            spellScroll={spellScroll}
            sprite={spellScrollSprites[spellScroll.id]}
            isActive={selectedSpellScrollTypeId === spellScroll.id}
            cooldownRemaining={spellScrollCooldowns[spellScroll.id]}
            onSelect={handleSelectSpellScroll}
            onStartDrag={onStartDragSpellScroll}
          />
        {/each}
      </div>
    </div>
    <div class="hud-section">
      <div class="label">{UI_TEXT.factionsLabel}</div>
      <div class="factions">{UI_TEXT.foeFaction(foeFactionName)}</div>
    </div>
  </div>
  <div class="hint hud-hint" class:is-collapsed={isCollapsed}>{UI_TEXT.hintDrag}</div>
</div>
