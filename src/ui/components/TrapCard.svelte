<script lang="ts">
  import { spriteCanvas } from "../spriteCanvas";
  import type { TrapCardProps } from "../../types/ui/components/TrapCard.types";

  const { trap, sprite, isActive, onSelect, onStartDrag } = $props<TrapCardProps>();

  const dragThreshold = 6;
  let suppressClick = false;

  const handlePointerDown = (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.hypot(dx, dy) > dragThreshold) {
        suppressClick = true;
        onStartDrag(trap.id);
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
    onSelect(isActive ? null : trap.id);
  };
</script>

<button
  class="trap-card"
  class:active={isActive}
  type="button"
  onclick={handleClick}
  onpointerdown={handlePointerDown}
>
  <canvas class="tower-sprite" width="36" height="36" use:spriteCanvas={sprite ?? null}></canvas>
  <div class="tower-card__content">
    <h4>{trap.name}</h4>
    <span class="tower-card__cost">({trap.cost}g)</span>
    <div class="tower-card__details">
      <div class="tower-card__types">{trap.types.join(" • ")}</div>
      <p>{trap.description}</p>
    </div>
  </div>
</button>
