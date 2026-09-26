"use client";

/**
 * Procedural Vinyl Crackle & Mechanical Click Audio Generator
 * Synthesized entirely via browser Web Audio API (0 KB external audio asset overhead).
 */

class VinylCrackleSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning = false;
  private crackleTimer: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  /**
   * Start authentic vinyl surface hiss and randomized micro-pops
   */
  public start(volume = 0.12) {
    if (this.isRunning) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.isRunning = true;

      // 1. Master crackle gain node
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.gainNode = masterGain;

      // 2. Continuous surface noise (warm pinkish hiss filtered like vinyl run-in groove)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0555179;
        b1 = 0.96300 * b1 + white * 0.0750759;
        b2 = 0.57000 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.08;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to match turntable groove rumble & high-frequency friction
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(0.8, this.ctx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(masterGain);
      whiteNoise.start();
      this.noiseNode = whiteNoise;

      // 3. Periodic randomized pops and dust clicks
      const triggerPop = () => {
        if (!this.isRunning || !this.ctx || !this.gainNode) return;

        const popTime = this.ctx.currentTime;
        const popGain = this.ctx.createGain();
        const popFilter = this.ctx.createBiquadFilter();

        popFilter.type = "highpass";
        popFilter.frequency.setValueAtTime(2500 + Math.random() * 3000, popTime);

        // Micro impulse
        const osc = this.ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(80 + Math.random() * 120, popTime);

        popGain.gain.setValueAtTime(0.001, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.08 + Math.random() * 0.18, popTime + 0.001);
        popGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.008 + Math.random() * 0.015);

        osc.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.gainNode);

        osc.start(popTime);
        osc.stop(popTime + 0.03);

        // Schedule next random pop
        const nextDelay = 80 + Math.random() * 600;
        this.crackleTimer = window.setTimeout(triggerPop, nextDelay);
      };

      triggerPop();
    } catch {
      // Audio context may be restricted before user gesture
      this.isRunning = false;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.crackleTimer !== null) {
      clearTimeout(this.crackleTimer);
      this.crackleTimer = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignore
      }
      this.noiseNode = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Ignore
      }
      this.gainNode = null;
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Sound of needle touching vinyl groove (thump + quick needle slide)
   */
  public playNeedleDrop() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound of analog switch/lever mechanical click
   */
  public playMechanicalClick() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const vinylCrackle = new VinylCrackleSynthesizer();
