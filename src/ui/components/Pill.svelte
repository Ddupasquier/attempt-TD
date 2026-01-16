<script lang="ts">
  import type { PillProps } from "../../types/ui/components/Pill.types";

  const { label, variant = "default", size = "sm" } = $props<PillProps>();
</script>

<span class={`pill pill--${variant} pill--${size}`}>
  {label}
</span>
