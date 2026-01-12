<script lang="ts">
  import type { ResetIconProps } from "../../../types/ui/components/icons/ResetIcon.types";

  const { size = 18, strokeWidth = 1.8 } = $props<ResetIconProps>();
</script>

<svg viewBox="0 0 24 24" aria-hidden="true" width={size} height={size}>
  <path
    d="M19.7285 10.9288C20.4413 13.5978 19.7507 16.5635 17.6569 18.6573C15.1798 21.1344 11.4826 21.6475 8.5 20.1966M18.364 8.05071L17.6569 7.3436C14.5327 4.21941 9.46736 4.21941 6.34316 7.3436C3.42964 10.2571 3.23318 14.8588 5.75376 18M18.364 8.05071H14.1213M18.364 8.05071V3.80807"
    fill="none"
    stroke="currentColor"
    stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
