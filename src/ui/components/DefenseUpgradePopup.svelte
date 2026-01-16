<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import FloatingPanel from "./FloatingPanel.svelte";
  import Pill from "./Pill.svelte";
  import { UI_TEXT } from "../text";
  import { DEFENSE_IDS } from "../../constants/defenseIds";
  import type { DefenseUpgradePopupProps } from "../../types/ui/components/DefenseUpgradePopup.types";

  const { popup, boundsWidth, boundsHeight, onUpgrade, onDelete, onSetTarget, onClose } =
    $props<DefenseUpgradePopupProps>();

  const formatStat = (value: number) => {
    if (Number.isInteger(value)) return value.toFixed(0);
    return value.toFixed(2);
  };

  const formatDelta = (currentValue: number, nextValue: number | null) => {
    if (nextValue === null || nextValue === undefined) return "";
    const delta = nextValue - currentValue;
    if (delta <= 0) return "";
    return `+${formatStat(delta)}`;
  };

  const formatBuff = (baseValue: number, boostedValue: number) => {
    const delta = boostedValue - baseValue;
    if (delta <= 0) return "";
    return `+${formatStat(delta)}`;
  };

  const formatEnvBuff = (rawValue: number, baseValue: number) => {
    const delta = baseValue - rawValue;
    if (delta <= 0) return "";
    return `+${formatStat(delta)}`;
  };

  const formatAuraDelta = (baseValue: number, boostedValue: number) => {
    const delta = boostedValue - baseValue;
    if (delta === 0) return "";
    const sign = delta > 0 ? "+" : "";
    return `${sign}${formatStat(delta)}`;
  };

  const formatAuraRateDelta = (baseValue: number, boostedValue: number) => {
    const delta = baseValue - boostedValue;
    if (delta === 0) return "";
    return `+${formatStat(delta)}`;
  };

  const formatPoint = (value: number) => value.toFixed(2);

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
        <div class="defense-upgrade__label">
          <span>{UI_TEXT.statDamage}</span>
          <span class="defense-upgrade__total">
            {formatStat(popup.statsCurrent.damage)}
          </span>
          {#if popup.statsNext}
            <span class="defense-upgrade__next">
              Next LVL {formatDelta(popup.statsCurrent.damage, popup.statsNext.damage)}
            </span>
          {/if}
        </div>
        <div class="defense-upgrade__value">
          <Pill label={`Base ${formatStat(popup.statsBaseRaw.damage)}`} variant="base" />
          <div class="defense-upgrade__pill-row">
            {#if popup.statsBase.damage > popup.statsBaseRaw.damage}
              <Pill
                label={`${formatEnvBuff(popup.statsBaseRaw.damage, popup.statsBase.damage)} env`}
                variant="env"
              />
            {/if}
            {#if popup.statsCurrent.damage > popup.statsBase.damage}
              <Pill
                label={`${formatAuraDelta(popup.statsBase.damage, popup.statsCurrent.damage)} aura`}
                variant="aura"
              />
            {/if}
          </div>
        </div>
      </div>
      <div class="defense-upgrade__stat">
        <div class="defense-upgrade__label">
          <span>{UI_TEXT.statRange}</span>
          <span class="defense-upgrade__total">
            {formatStat(popup.statsCurrent.range)}
          </span>
          {#if popup.statsNext}
            <span class="defense-upgrade__next">
              Next LVL {formatDelta(popup.statsCurrent.range, popup.statsNext.range)}
            </span>
          {/if}
        </div>
        <div class="defense-upgrade__value">
          <Pill label={`Base ${formatStat(popup.statsBaseRaw.range)}`} variant="base" />
          <div class="defense-upgrade__pill-row">
            {#if popup.statsBase.range > popup.statsBaseRaw.range}
              <Pill
                label={`${formatEnvBuff(popup.statsBaseRaw.range, popup.statsBase.range)} env`}
                variant="env"
              />
            {/if}
            {#if popup.statsCurrent.range > popup.statsBase.range}
              <Pill
                label={`${formatAuraDelta(popup.statsBase.range, popup.statsCurrent.range)} aura`}
                variant="aura"
              />
            {/if}
          </div>
        </div>
      </div>
      <div class="defense-upgrade__stat">
        <div class="defense-upgrade__label">
          <span>{UI_TEXT.statRate}</span>
          <span class="defense-upgrade__total">
            {formatStat(popup.statsCurrent.rate)}
          </span>
          {#if popup.statsNext}
            <span class="defense-upgrade__next">
              Next LVL {formatDelta(popup.statsCurrent.rate, popup.statsNext.rate)}
            </span>
          {/if}
        </div>
        <div class="defense-upgrade__value">
          <Pill label={`Base ${formatStat(popup.statsBaseRaw.rate)}`} variant="base" />
          <div class="defense-upgrade__pill-row">
            {#if popup.statsBase.rate > popup.statsBaseRaw.rate}
              <Pill
                label={`${formatEnvBuff(popup.statsBaseRaw.rate, popup.statsBase.rate)} env`}
                variant="env"
              />
            {/if}
            {#if popup.statsCurrent.rate !== popup.statsBase.rate}
              <Pill
                label={`${formatAuraRateDelta(popup.statsBase.rate, popup.statsCurrent.rate)} aura`}
                variant="aura"
              />
            {/if}
          </div>
        </div>
      </div>
      <div class="defense-upgrade__stat">
        <div class="defense-upgrade__label">
          <span>{UI_TEXT.statKnockback}</span>
          <span class="defense-upgrade__total">
            {formatStat(popup.statsCurrent.knockback)}
          </span>
          {#if popup.statsNext}
            <span class="defense-upgrade__next">
              Next LVL {formatDelta(popup.statsCurrent.knockback, popup.statsNext.knockback)}
            </span>
          {/if}
        </div>
        <div class="defense-upgrade__value">
          <Pill label={`Base ${formatStat(popup.statsBaseRaw.knockback)}`} variant="base" />
          <div class="defense-upgrade__pill-row">
            {#if popup.statsBase.knockback > popup.statsBaseRaw.knockback}
              <Pill
                label={`${formatEnvBuff(popup.statsBaseRaw.knockback, popup.statsBase.knockback)} env`}
                variant="env"
              />
            {/if}
            {#if popup.statsCurrent.knockback > popup.statsBase.knockback}
              <Pill
                label={`${formatAuraDelta(popup.statsBase.knockback, popup.statsCurrent.knockback)} aura`}
                variant="aura"
              />
            {/if}
          </div>
        </div>
      </div>
    </div>
    {#if popup.auraDebug?.sources?.length}
      <div class="defense-upgrade__debug">
        <div class="defense-upgrade__debug-title">Aura Debug (dev)</div>
        {#each popup.auraDebug.sources as source}
          <div class="defense-upgrade__debug-row">
            <span>{source.name} [{source.col},{source.row}]</span>
            <span>dist {formatPoint(source.distance)} / range {formatPoint(source.range)}</span>
            <span class:applies={source.applies}>{source.reason}</span>
          </div>
        {/each}
      </div>
    {/if}
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
