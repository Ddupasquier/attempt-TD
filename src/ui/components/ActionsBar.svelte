<script lang="ts">
  import { UI_TEXT } from "../text";

  const { isCountingDown, countdownRemaining, soundEnabled, onStartWave, onResetGame, onToggleSound } = $props();
  const getCountdownSeconds = () => Math.max(1, Math.ceil(countdownRemaining));
</script>

<div class="actions-bar">
  <!-- svelte-ignore event_directive_deprecated -->
  <button
    class="action-button action-start action-button--text"
    class:is-counting={isCountingDown}
    data-countdown={isCountingDown ? getCountdownSeconds() : null}
    disabled={isCountingDown}
    aria-label={isCountingDown ? UI_TEXT.nextWave(getCountdownSeconds()) : UI_TEXT.startWaveAria}
    type="button"
    on:click={onStartWave}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="8,6 18,12 8,18"></polygon>
    </svg>
    <span class="action-label">{UI_TEXT.startWaveLabel}</span>
  </button>
  <button
    class="action-button action-reset"
    type="button"
    aria-label={UI_TEXT.resetAria}
    on:click={onResetGame}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6v5h5M19 12a7 7 0 1 1-2.05-4.95"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
  <button
    class="action-button action-sound"
    class:is-muted={!soundEnabled}
    type="button"
    aria-label={soundEnabled ? UI_TEXT.soundOnAria : UI_TEXT.soundOffAria}
    on:click={onToggleSound}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10h4l5-4v12l-5-4H4z"></path>
      <path class="sound-wave" d="M16 9c1.2 1 1.2 5 0 6" fill="none" stroke="currentColor" stroke-width="2" />
      <path class="sound-wave" d="M18.5 7c2 2 2 8 0 10" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
  </button>
</div>
