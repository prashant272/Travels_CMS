/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer for Travel Agency CRM
// Zero external files, zero bandwidth, works offline 100% reliably.

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem('yatridesk_sound_enabled');
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('yatridesk_sound_enabled', String(this.soundEnabled));
    } catch {}
    if (this.soundEnabled) {
      this.playTactileClick();
    }
    return this.soundEnabled;
  }

  private getContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // 1. Airport Boarding Chime (Ding-Dong) - Flight Mode / Login Takeoff
  public playFlightChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: High chime (F5: ~698Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(698.46, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);

      // Note 2: Low chime (C5: ~523Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.35);
      gain2.gain.setValueAtTime(0.22, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // 2. IRCTC Railway Horn / Whistle Melody - Train Mode
  public playTrainWhistle(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dual-tone harmonic train whistle (E4 & G#4)
      const freqs = [329.63, 415.30];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq + 15, now + 0.2);
        osc.frequency.linearRampToValueAtTime(freq, now + 0.45);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // 3. Express Bus Cheerful Double-Beep Horn - Bus Mode
  public playBusHorn(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      gain1.gain.setValueAtTime(0.14, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Beep 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, now + 0.18);
      gain2.gain.setValueAtTime(0.16, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.38);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // 4. Ticket Stamp / Boarding Pass Success Sound
  public playSuccessSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  // 5. Tactile UI Click Sound
  public playTactileClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const soundEffects = new SoundEffectsService();
