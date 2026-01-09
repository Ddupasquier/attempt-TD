<script lang="ts">
  import { UI_TEXT } from "../text";
  import PlayIcon from "./icons/PlayIcon.svelte";
  import ResetIcon from "./icons/ResetIcon.svelte";
  import SoundIcon from "./icons/SoundIcon.svelte";

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
    <PlayIcon />
    <span class="action-label">{UI_TEXT.startWaveLabel}</span>
  </button>
  <button
    class="action-button action-reset"
    type="button"
    aria-label={UI_TEXT.resetAria}
    on:click={onResetGame}
  >
    <ResetIcon />
  </button>
  <button
    class="action-button action-sound"
    class:is-muted={!soundEnabled}
    type="button"
    aria-label={soundEnabled ? UI_TEXT.soundOnAria : UI_TEXT.soundOffAria}
    on:click={onToggleSound}
  >
    <SoundIcon />
  </button>
</div>
