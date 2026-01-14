<script lang="ts">
  import { spriteCanvas } from "../spriteCanvas";
  import type { DefenseCardProps } from "../../types/ui/components/DefenseCard.types";

  const { defense, sprite, isActive, canAfford, cost, onSelect, onStartDrag } =
    $props<DefenseCardProps>();

  const dragThreshold = 6;
  let suppressClick = false;

  const handlePointerDown = (event: PointerEvent) => {
    if (!canAfford) return;
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.hypot(dx, dy) > dragThreshold) {
        suppressClick = true;
        onStartDrag(defense.id);
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
    if (!canAfford) return;
    event.stopPropagation();
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    onSelect(isActive ? null : defense.id);
  };
</script>

<button
  class="defense-card"
  class:active={isActive}
  type="button"
  disabled={!canAfford}
  onclick={handleClick}
  onpointerdown={handlePointerDown}
>
  <canvas class="defense-sprite" width="36" height="36" use:spriteCanvas={sprite ?? null}></canvas>
  <div class="defense-card__content">
    <h4>{defense.name}</h4>
    <span class="defense-card__cost">({cost}g)</span>
    <div class="defense-card__details">
      <div class="defense-card__types">{defense.types.join(" • ")}</div>
      <p>{defense.description}</p>
    </div>
  </div>
</button>
