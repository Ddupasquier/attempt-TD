<script lang="ts">
  import { onMount } from "svelte";
  import { UI_TEXT } from "../text";
  import PlayIcon from "./icons/PlayIcon.svelte";
  import AutoIcon from "./icons/AutoIcon.svelte";
  import ResetIcon from "./icons/ResetIcon.svelte";
  import SoundIcon from "./icons/SoundIcon.svelte";
  import FullscreenIcon from "./icons/FullscreenIcon.svelte";
  import type { ActionsBarProps } from "../../types/ui/components/ActionsBar.types";

  const {
    isCountingDown,
    countdownRemaining,
    soundEnabled,
    autoWaveEnabled,
    speedMultiplier,
    onStartWave,
    onResetGame,
    onToggleSound,
    onToggleAutoWave,
    onToggleSpeed,
  } = $props<ActionsBarProps>();

  const getCountdownSeconds = () => Math.max(1, Math.ceil(countdownRemaining));
  const getSpeedLabel = () => {
    const label = Number.isInteger(speedMultiplier)
      ? `${speedMultiplier.toFixed(0)}x`
      : `${speedMultiplier.toFixed(1)}x`;
    return UI_TEXT.speedLabel(label);
  };

  let isFullscreenSupported = $state(false);
  let isFullscreen = $state(false);

  const updateFullscreenState = () => {
    if (typeof document === "undefined") return;
    isFullscreen = Boolean(document.fullscreenElement);
  };

  const handleToggleFullscreen = () => {
    if (typeof document === "undefined" || !isFullscreenSupported) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {
        // Ignore fullscreen exit failures (typically user-gesture restrictions).
      });
      return;
    }

    void document.documentElement.requestFullscreen().catch(() => {
      // Ignore fullscreen request failures (typically user-gesture restrictions).
    });
  };

  onMount(() => {
    if (typeof document === "undefined") return;

    isFullscreenSupported = Boolean(document.fullscreenEnabled);
    updateFullscreenState();

    const handleFullscreenChange = () => {
      updateFullscreenState();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  });
</script>

<div class="actions-bar">
  <button
    class="action-button action-start action-button--text"
    class:is-counting={isCountingDown}
    data-countdown={isCountingDown ? getCountdownSeconds() : null}
    disabled={isCountingDown}
    aria-label={isCountingDown
      ? UI_TEXT.nextWave(getCountdownSeconds())
      : UI_TEXT.startWaveAria}
    type="button"
    onclick={onStartWave}
  >
    <PlayIcon />
    <span class="action-label">{UI_TEXT.startWaveLabel}</span>
  </button>
  <button
    class="action-button action-auto"
    class:is-active={autoWaveEnabled}
    type="button"
    aria-label={autoWaveEnabled
      ? UI_TEXT.autoWaveOnAria
      : UI_TEXT.autoWaveOffAria}
    onclick={onToggleAutoWave}
  >
    <AutoIcon />
  </button>
  <button
    class="action-button action-reset"
    type="button"
    aria-label={UI_TEXT.resetAria}
    onclick={onResetGame}
  >
    <ResetIcon />
  </button>
  <button
    class="action-button action-sound"
    class:is-muted={!soundEnabled}
    type="button"
    aria-label={soundEnabled ? UI_TEXT.soundOnAria : UI_TEXT.soundOffAria}
    onclick={onToggleSound}
  >
    <SoundIcon />
  </button>
  <button
    class="action-button action-speed"
    class:is-active={speedMultiplier > 1}
    type="button"
    aria-label={getSpeedLabel()}
    onclick={onToggleSpeed}
  >
    <span class="action-speed__label">
      {Number.isInteger(speedMultiplier)
        ? `${speedMultiplier.toFixed(0)}x`
        : `${speedMultiplier.toFixed(1)}x`}
    </span>
  </button>
  {#if isFullscreenSupported}
    <button
      class="action-button action-fullscreen"
      type="button"
      aria-label={isFullscreen ? UI_TEXT.fullscreenExitAria : UI_TEXT.fullscreenEnterAria}
      onclick={handleToggleFullscreen}
    >
      <FullscreenIcon isExit={isFullscreen} />
    </button>
  {/if}
</div>
