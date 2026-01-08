<script lang="ts">
  import type { PixelSprite, TowerType } from "../../core/types";
  import { spriteCanvas } from "../spriteCanvas";

  type TowerCardProps = {
    tower: TowerType;
    sprite: PixelSprite | undefined;
    isActive: boolean;
    onSelect: (towerId: string | null) => void;
    onStartDrag: (towerId: string) => void;
  };

  const { tower, sprite, isActive, onSelect, onStartDrag } = $props() as TowerCardProps;

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
        onStartDrag(tower.id);
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
    onSelect(isActive ? null : tower.id);
  };
</script>

<!-- svelte-ignore event_directive_deprecated -->
<button
  class="tower-card"
  class:active={isActive}
  type="button"
  on:click={handleClick}
  on:pointerdown={handlePointerDown}
>
  <canvas class="tower-sprite" width="36" height="36" use:spriteCanvas={sprite ?? null}></canvas>
  <div class="tower-card__content">
    <h4>{tower.name}</h4>
    <span class="tower-card__cost">({tower.cost}g)</span>
    <div class="tower-card__details">
      <div class="tower-card__types">{tower.types.join(" • ")}</div>
      <p>{tower.description}</p>
    </div>
  </div>
</button>
