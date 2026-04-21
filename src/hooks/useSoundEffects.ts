const audioCtx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export const sfx = {
  click: () => playTone(800, 0.08, 'square', 0.08),
  success: () => {
    playTone(523, 0.15, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 100);
    setTimeout(() => playTone(784, 0.25, 'sine', 0.12), 200);
  },
  select: () => playTone(600, 0.1, 'triangle', 0.1),
  deselect: () => playTone(400, 0.1, 'triangle', 0.08),
  navigate: () => playTone(440, 0.12, 'sine', 0.1),
  submit: () => {
    playTone(440, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(660, 0.1, 'sine', 0.15), 80);
    setTimeout(() => playTone(880, 0.3, 'sine', 0.15), 160);
  },
  complete: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.3, 'sine', 0.12), i * 150)
    );
  },
  correct: () => {
    playTone(659, 0.12, 'sine', 0.14);
    setTimeout(() => playTone(988, 0.22, 'sine', 0.14), 90);
  },
  wrong: () => {
    playTone(220, 0.18, 'sawtooth', 0.12);
    setTimeout(() => playTone(165, 0.28, 'sawtooth', 0.12), 120);
  },
};
