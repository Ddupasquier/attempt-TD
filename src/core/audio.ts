type ToneConfig = {
  freq: number;
  duration: number;
  type: OscillatorType;
  gain: number;
};

const createAudioSystem = () => {
  let audioCtx: AudioContext | null = null;

  const tonePresets: Record<string, Omit<ToneConfig, "duration">> = {
    mage: { freq: 520, type: "triangle", gain: 0.06 },
    archer: { freq: 740, type: "square", gain: 0.05 },
    blade: { freq: 360, type: "square", gain: 0.07 },
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

  const unlock = () => {
    ensureAudioContext();
  };

  const playDamageSound = (towerTypeId: string, soundEnabled: boolean) => {
    if (!soundEnabled) return;
    ensureAudioContext();
    if (!audioCtx) return;
    const tone = tonePresets[towerTypeId];
    if (!tone) return;
    playTone({ ...tone, duration: 0.08 });
  };

  return { unlock, playDamageSound };
};

export { createAudioSystem };
