class SoundSystem {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type, duration, vol) {
    if (!this.audioCtx) this.init();
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1, 0.1);
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.1), 200); // G5
  }

  playGood() {
    this.playTone(440, 'sine', 0.1, 0.1); // A4
    setTimeout(() => this.playTone(554.37, 'sine', 0.2, 0.1), 150); // C#5
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.2, 0.1);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.4, 0.1), 150);
  }
}

export const sounds = new SoundSystem();
