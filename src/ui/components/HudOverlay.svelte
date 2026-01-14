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
  let selectedSpellScrollTypeId = $state<string | null>(null);

  const handleSelectSpellScroll = (spellScrollId: string | null) => {
    selectedSpellScrollTypeId = spellScrollId;
  };
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
      <div class="tower-hint">{UI_TEXT.hintTowerSelect}</div>
      <div class="tower-list">
        {#each defenseTypes as defense (defense.id)}
          <DefenseCard
            defense={defense}
            sprite={defenseSprites[defense.id]}
            isActive={selectedDefenseTypeId === defense.id}
            canAfford={gold >= defense.cost}
            onSelect={onSelectDefense}
            onStartDrag={onStartDragDefense}
          />
        {/each}
      </div>
    </div>
    <div class="hud-section">
      <div class="label">{UI_TEXT.trapLabel}</div>
      <div class="tower-hint">{UI_TEXT.hintTrapDrag}</div>
      <div class="tower-list">
        {#each spellScrollTypes as spellScroll (spellScroll.id)}
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
