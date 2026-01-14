import { DEFENSE_IDS } from "../constants/defenseIds";
import { SPELL_SCROLL_IDS } from "../constants/spellScrollIds";
import type { ToneConfig } from "../types/core/audioTypes";

const createAudioSystem = () => {
  let audioCtx: AudioContext | null = null;
  let isUnlocked = false;

  const tonePresets: Record<string, Omit<ToneConfig, "duration">> = {
    [DEFENSE_IDS.wizard]: { freq: 520, type: "triangle", gain: 0.06 },
    [DEFENSE_IDS.ranger]: { freq: 740, type: "square", gain: 0.05 },
    [DEFENSE_IDS.fighter]: { freq: 360, type: "square", gain: 0.07 },
  };

  const ensureAudioContext = () => {
    if (!audioCtx) {
      const WebkitAudioContext = (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
      audioCtx = window.AudioContext ? new AudioContext() : WebkitAudioContext ? new WebkitAudioContext() : null;
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  };

  const playTone = ({ freq, duration, type, gain }: ToneConfig) => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    volume.gain.value = gain;
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
  };

  const playNoise = (duration: number, gain: number, filterType: BiquadFilterType, filterFreq: number) => {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    const volume = audioCtx.createGain();
    volume.gain.value = gain;
    source.connect(filter);
    filter.connect(volume);
    volume.connect(audioCtx.destination);
    source.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    source.stop(audioCtx.currentTime + duration);
  };

  const playBoom = () => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(90, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
    volume.gain.value = 0.12;
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
    oscillator.stop(audioCtx.currentTime + 0.28);
  };

  const playCrash = () => {
    if (!audioCtx) return;
    playNoise(0.14, 0.07, "lowpass", 420);
    const oscillator = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);
    volume.gain.value = 0.06;
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);
    oscillator.stop(audioCtx.currentTime + 0.16);
  };

  const playBigBoom = () => {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const volume = audioCtx.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(140, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
    volume.gain.value = 0.18;
    oscillator.connect(volume);
    volume.connect(audioCtx.destination);
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
    oscillator.stop(audioCtx.currentTime + 0.7);
  };
  const unlock = () => {
    isUnlocked = true;
    ensureAudioContext();
  };

  const playDamageSound = (defenseTypeId: string, soundEnabled: boolean) => {
    if (!soundEnabled) return;
    if (!isUnlocked) return;
    ensureAudioContext();
    if (!audioCtx) return;
    if (defenseTypeId === DEFENSE_IDS.siegeEngine) {
      playCrash();
      return;
    }
    const tone = tonePresets[defenseTypeId];
    if (!tone) return;
    playTone({ ...tone, duration: 0.08 });
  };

  const playSpellScrollSound = (scrollId: string, soundEnabled: boolean) => {
    if (!soundEnabled) return;
    if (!isUnlocked) return;
    ensureAudioContext();
    if (!audioCtx) return;
    if (scrollId === SPELL_SCROLL_IDS.shock) {
      playNoise(0.12, 0.08, "bandpass", 1200);
      return;
    }
    if (scrollId === SPELL_SCROLL_IDS.bomb) {
      playBoom();
      return;
    }
    if (scrollId === SPELL_SCROLL_IDS.nuke) {
      playBigBoom();
      return;
    }
    if (scrollId === SPELL_SCROLL_IDS.glue) {
      playTone({ freq: 160, duration: 0.08, type: "sine", gain: 0.05 });
    }
  };

  return { unlock, playDamageSound, playSpellScrollSound };
};

export { createAudioSystem };
