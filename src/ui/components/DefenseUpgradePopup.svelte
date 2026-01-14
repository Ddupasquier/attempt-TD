<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import FloatingPanel from "./FloatingPanel.svelte";
  import { UI_TEXT } from "../text";
  import { DEFENSE_IDS } from "../../constants/defenseIds";
  import type { DefenseUpgradePopupProps } from "../../types/ui/components/DefenseUpgradePopup.types";

  const { popup, boundsWidth, boundsHeight, onUpgrade, onDelete, onSetTarget, onClose } =
    $props<DefenseUpgradePopupProps>();

  const formatStat = (value: number) => {
    if (Number.isInteger(value)) return value.toFixed(0);
    return value.toFixed(2);
  };

  const handleUpgrade = () => {
    onUpgrade(popup.id);
  };

  const handleDelete = () => {
    onDelete(popup.id);
    onClose();
  };

  const handleSetTarget = () => {
    onSetTarget(popup.id);
    onClose();
  };

  onMount(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      const panel = (event.target as Node | null)?.closest(".defense-upgrade");
      if (panel) return;
      onClose();
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  });

</script>

<FloatingPanel
  x={popup.x}
  y={popup.y}
  boundsWidth={boundsWidth}
  boundsHeight={boundsHeight}
  className="defense-upgrade"
>
  <div class="defense-upgrade__header">
    <div class="defense-upgrade__title">{UI_TEXT.upgradeTitle}</div>
    <div class="defense-upgrade__level">{UI_TEXT.upgradeLevel(popup.level, popup.maxLevel)}</div>
  </div>
  <div class="defense-upgrade__name">{popup.name}</div>
  <div class="defense-upgrade__types">{popup.types.join(" • ")}</div>
  <div class="defense-upgrade__body">
    <div class="defense-upgrade__prompt">{UI_TEXT.upgradePrompt}</div>
    <div class="defense-upgrade__cost">
      {popup.canUpgrade ? UI_TEXT.upgradeCost(popup.upgradeCost) : UI_TEXT.upgradeMax}
    </div>
    {#if popup.typeId === DEFENSE_IDS.siegeEngine}
      <div class="defense-upgrade__target">
        {UI_TEXT.siegeTargetLabel(popup.targetCol, popup.targetRow)}
      </div>
    {/if}
    <div class="defense-upgrade__stats">
      <div class="defense-upgrade__stat">
        <span>{UI_TEXT.statDamage}</span>
        <span class="defense-upgrade__value">
          {formatStat(popup.statsCurrent.damage)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.damage)}` : ""}
        </span>
      </div>
      <div class="defense-upgrade__stat">
        <span>{UI_TEXT.statRange}</span>
        <span class="defense-upgrade__value">
          {formatStat(popup.statsCurrent.range)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.range)}` : ""}
        </span>
      </div>
      <div class="defense-upgrade__stat">
        <span>{UI_TEXT.statRate}</span>
        <span class="defense-upgrade__value">
          {formatStat(popup.statsCurrent.rate)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.rate)}` : ""}
        </span>
      </div>
      <div class="defense-upgrade__stat">
        <span>{UI_TEXT.statKnockback}</span>
        <span class="defense-upgrade__value">
          {formatStat(popup.statsCurrent.knockback)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.knockback)}` : ""}
        </span>
      </div>
    </div>
  </div>
  <button
    class="defense-upgrade__button"
    type="button"
    disabled={!popup.canUpgrade || !popup.canAfford}
    onclick={handleUpgrade}
  >
    {UI_TEXT.upgradeButton}
  </button>
  {#if popup.typeId === DEFENSE_IDS.siegeEngine}
    <button
      class="defense-upgrade__button"
      type="button"
      aria-label={UI_TEXT.siegeSetTargetAria}
      onclick={handleSetTarget}
    >
      {UI_TEXT.siegeSetTargetLabel}
    </button>
  {/if}
  <button
    class="defense-upgrade__button defense-upgrade__button--danger"
    type="button"
    aria-label={UI_TEXT.removeDefenseAria}
    onclick={handleDelete}
  >
    {UI_TEXT.removeDefenseLabel}
  </button>
</FloatingPanel>
