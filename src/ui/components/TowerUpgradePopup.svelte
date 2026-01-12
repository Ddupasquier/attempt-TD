<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import FloatingPanel from "./FloatingPanel.svelte";
  import { UI_TEXT } from "../text";
  import { TOWER_IDS } from "../../constants/towerIds";
  import type { TowerUpgradePopupProps } from "../../types/ui/components/TowerUpgradePopup.types";

  const { popup, boundsWidth, boundsHeight, onUpgrade, onDelete, onSetTarget, onClose } =
    $props<TowerUpgradePopupProps>();

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
      const panel = (event.target as Node | null)?.closest(".tower-upgrade");
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
  className="tower-upgrade"
>
  <div class="tower-upgrade__header">
    <div class="tower-upgrade__title">{UI_TEXT.upgradeTitle}</div>
    <div class="tower-upgrade__level">{UI_TEXT.upgradeLevel(popup.level, popup.maxLevel)}</div>
  </div>
  <div class="tower-upgrade__body">
    <div class="tower-upgrade__prompt">{UI_TEXT.upgradePrompt}</div>
    <div class="tower-upgrade__cost">
      {popup.canUpgrade ? UI_TEXT.upgradeCost(popup.upgradeCost) : UI_TEXT.upgradeMax}
    </div>
    {#if popup.typeId === TOWER_IDS.catapult}
      <div class="tower-upgrade__target">
        {UI_TEXT.catapultTargetLabel(popup.targetCol, popup.targetRow)}
      </div>
    {/if}
    <div class="tower-upgrade__stats">
      <div class="tower-upgrade__stat">
        <span>{UI_TEXT.statDamage}</span>
        <span class="tower-upgrade__value">
          {formatStat(popup.statsCurrent.damage)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.damage)}` : ""}
        </span>
      </div>
      <div class="tower-upgrade__stat">
        <span>{UI_TEXT.statRange}</span>
        <span class="tower-upgrade__value">
          {formatStat(popup.statsCurrent.range)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.range)}` : ""}
        </span>
      </div>
      <div class="tower-upgrade__stat">
        <span>{UI_TEXT.statRate}</span>
        <span class="tower-upgrade__value">
          {formatStat(popup.statsCurrent.rate)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.rate)}` : ""}
        </span>
      </div>
      <div class="tower-upgrade__stat">
        <span>{UI_TEXT.statKnockback}</span>
        <span class="tower-upgrade__value">
          {formatStat(popup.statsCurrent.knockback)}
          {popup.statsNext ? ` ${UI_TEXT.statArrow} ${formatStat(popup.statsNext.knockback)}` : ""}
        </span>
      </div>
    </div>
  </div>
  <button
    class="tower-upgrade__button"
    type="button"
    disabled={!popup.canUpgrade || !popup.canAfford}
    onclick={handleUpgrade}
  >
    {UI_TEXT.upgradeButton}
  </button>
  {#if popup.typeId === TOWER_IDS.catapult}
    <button
      class="tower-upgrade__button"
      type="button"
      aria-label={UI_TEXT.catapultSetTargetAria}
      onclick={handleSetTarget}
    >
      {UI_TEXT.catapultSetTargetLabel}
    </button>
  {/if}
  <button
    class="tower-upgrade__button tower-upgrade__button--danger"
    type="button"
    aria-label={UI_TEXT.removeTowerAria}
    onclick={handleDelete}
  >
    {UI_TEXT.removeTowerLabel}
  </button>
</FloatingPanel>
