let sharedCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  try {
    if (!sharedCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      sharedCtx = new Ctor();
    }
    if (sharedCtx.state === 'suspended') {
      // Resume on next user gesture-triggered call
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15, delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  } catch {}
}

export const sfx = {
  click: () => playTone(800, 0.08, 'square', 0.08),
  success: () => {
    playTone(523, 0.15, 'sine', 0.12, 0);
    playTone(659, 0.15, 'sine', 0.12, 0.1);
    playTone(784, 0.25, 'sine', 0.12, 0.2);
  },
  select: () => playTone(600, 0.1, 'triangle', 0.1),
  deselect: () => playTone(400, 0.1, 'triangle', 0.08),
  navigate: () => playTone(440, 0.12, 'sine', 0.1),
  submit: () => {
    playTone(440, 0.1, 'sine', 0.15, 0);
    playTone(660, 0.1, 'sine', 0.15, 0.08);
    playTone(880, 0.3, 'sine', 0.15, 0.16);
  },
  complete: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      playTone(f, 0.3, 'sine', 0.12, i * 0.15)
    );
  },
  correct: () => {
    playTone(784, 0.14, 'sine', 0.18, 0);
    playTone(1047, 0.14, 'sine', 0.18, 0.1);
    playTone(1319, 0.28, 'sine', 0.18, 0.2);
  },
  wrong: () => {
    playTone(280, 0.18, 'sawtooth', 0.16, 0);
    playTone(180, 0.32, 'sawtooth', 0.16, 0.14);
  },
};
