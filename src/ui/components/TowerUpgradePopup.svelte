<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { UI_TEXT } from "../text";
  import type { TowerUpgradePopupProps } from "../../types/ui/components/TowerUpgradePopup.types";

  const { popup, onUpgrade, onClose } = $props<TowerUpgradePopupProps>();

  let rootElement: HTMLDivElement | null = null;

  const formatStat = (value: number) => {
    if (Number.isInteger(value)) return value.toFixed(0);
    return value.toFixed(2);
  };

  const handleUpgrade = () => {
    onUpgrade(popup.id);
  };

  onMount(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!rootElement) return;
      if (rootElement.contains(event.target as Node)) return;
      onClose();
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  });

  onDestroy(() => {
    rootElement = null;
  });
</script>

<div
  class="tower-upgrade"
  bind:this={rootElement}
  style={`left: ${popup.x}px; top: ${popup.y}px;`}
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
</div>
