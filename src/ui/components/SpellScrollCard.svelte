<script lang="ts">
  import { spriteCanvas } from "../spriteCanvas";
  import type { SpellScrollCardProps } from "../../types/ui/components/SpellScrollCard.types";

  const { spellScroll, sprite, isActive, cooldownRemaining = 0, onSelect, onStartDrag } =
    $props<SpellScrollCardProps>();

  const dragThreshold = 6;
  let suppressClick = false;

  const handlePointerDown = (event: PointerEvent) => {
    if (cooldownRemaining > 0) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.hypot(dx, dy) > dragThreshold) {
        suppressClick = true;
        onStartDrag(spellScroll.id);
        cleanup();
      }
    };

    const onUp = () => {
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    onSelect(isActive ? null : spellScroll.id);
  };
</script>

<button
  class="spell-scroll-card"
  class:active={isActive}
  class:is-counting={cooldownRemaining > 0}
  data-countdown={
    cooldownRemaining && Number.isFinite(cooldownRemaining)
      ? Math.ceil(cooldownRemaining)
      : cooldownRemaining
        ? "W"
        : null
  }
  type="button"
  onclick={handleClick}
  onpointerdown={handlePointerDown}
>
  <canvas class="spell-scroll-sprite" width="36" height="36" use:spriteCanvas={sprite ?? null}></canvas>
  <div class="spell-scroll-card__content">
    <h4>{spellScroll.name}</h4>
    <span class="spell-scroll-card__cost">({spellScroll.cost}g)</span>
    <div class="spell-scroll-card__details">
      <div class="spell-scroll-card__types">{spellScroll.types.join(" • ")}</div>
      <p>{spellScroll.description}</p>
    </div>
  </div>
</button>
