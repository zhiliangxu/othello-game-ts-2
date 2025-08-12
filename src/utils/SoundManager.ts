export class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context when first used
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported in this browser');
    }
  }

  public playPlacePieceSound(): void {
    if (!this.audioContext) return;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a simple click sound using oscillator
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure the sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  public playFlipSound(): void {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a flip sound with multiple tones
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator1.frequency.setValueAtTime(600, this.audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(900, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime + 0.05);
      oscillator1.stop(this.audioContext.currentTime + 0.15);
      oscillator2.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Error playing flip sound:', error);
    }
  }

  public playGameOverSound(): void {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a game over sound sequence
      const frequencies = [523, 466, 392, 349]; // C, Bb, G, F
      let startTime = this.audioContext.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);

        startTime += 0.2;
      });
    } catch (error) {
      console.warn('Error playing game over sound:', error);
    }
  }
}
