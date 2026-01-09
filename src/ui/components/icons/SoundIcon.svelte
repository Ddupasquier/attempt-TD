<script lang="ts">
  const { size = 18 } = $props() as { size?: number };
</script>

<svg viewBox="0 0 24 24" aria-hidden="true" width={size} height={size}>
  <path d="M4 10h4l5-4v12l-5-4H4z"></path>
  <path class="sound-wave" d="M16 9c1.2 1 1.2 5 0 6" fill="none" stroke="currentColor" stroke-width="2" />
  <path class="sound-wave" d="M18.5 7c2 2 2 8 0 10" fill="none" stroke="currentColor" stroke-width="2" />
</svg>
