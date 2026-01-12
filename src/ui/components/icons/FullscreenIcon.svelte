<script lang="ts">
  import type { FullscreenIconProps } from "../../../types/ui/components/icons/FullscreenIcon.types";

  const { size = 18, isExit = false } = $props<FullscreenIconProps>();
</script>

<svg viewBox="0 0 24 24" aria-hidden="true" width={size} height={size}>
  {#if isExit}
    <path
      d="M5 16h3v3h2v-5H5v2zm0-8h5V3H8v3H5v2zm14 8v3h-3v2h5v-5h-2zm-5-8h3V3h2v5h-5V8z"
    ></path>
  {:else}
    <path
      d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 9h-3v2h5v-5h-2v3zm0-14v3h2V5h-5v2h3z"
    ></path>
  {/if}
</svg>
