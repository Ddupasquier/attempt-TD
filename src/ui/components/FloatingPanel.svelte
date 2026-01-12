<script lang="ts">
  import type { FloatingPanelProps } from "../../types/ui/components/FloatingPanel.types";

  const {
    x,
    y,
    boundsWidth,
    boundsHeight,
    padding = 8,
    className = "",
    children,
  } = $props<FloatingPanelProps>();

  let contentWidth = $state(0);
  let contentHeight = $state(0);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  const clampAxis = (value: number, size: number, max: number) => {
    if (max <= 0 || size <= 0) return value;
    return clamp(value, padding, Math.max(padding, max - size - padding));
  };

  const clampedX = $derived(clampAxis(x, contentWidth, boundsWidth));
  const clampedY = $derived(clampAxis(y, contentHeight, boundsHeight));
</script>

<div
  class={`floating-panel ${className}`.trim()}
  style={`left: ${clampedX}px; top: ${clampedY}px;`}
  bind:clientWidth={contentWidth}
  bind:clientHeight={contentHeight}
>
  {@render children?.()}
</div>
