import { SoundManager } from './SoundManager';

describe('SoundManager', () => {
  let soundManager: SoundManager;

  beforeEach(() => {
    soundManager = new SoundManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize without errors', () => {
      expect(soundManager).toBeInstanceOf(SoundManager);
    });
  });

  describe('Sound Playback', () => {
    test('should play place piece sound without errors', () => {
      expect(() => soundManager.playPlacePieceSound()).not.toThrow();
    });

    test('should play flip sound without errors', () => {
      expect(() => soundManager.playFlipSound()).not.toThrow();
    });

    test('should play game over sound without errors', () => {
      expect(() => soundManager.playGameOverSound()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('should handle audio context creation errors gracefully', () => {
      // Mock AudioContext to throw an error
      const originalAudioContext = global.AudioContext;
      global.AudioContext = jest.fn().mockImplementation(() => {
        throw new Error('AudioContext not supported');
      });

      const manager = new SoundManager();
      
      // Should not throw errors even when AudioContext fails
      expect(() => manager.playPlacePieceSound()).not.toThrow();
      expect(() => manager.playFlipSound()).not.toThrow();
      expect(() => manager.playGameOverSound()).not.toThrow();

      // Restore original AudioContext
      global.AudioContext = originalAudioContext;
    });

    test('should handle oscillator errors gracefully', () => {
      // Mock createOscillator to throw an error
      const mockAudioContext = {
        createOscillator: jest.fn().mockImplementation(() => {
          throw new Error('Oscillator error');
        }),
        createGain: jest.fn().mockReturnValue({
          connect: jest.fn(),
          gain: {
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn()
          }
        }),
        destination: {},
        currentTime: 0,
        state: 'running',
        resume: jest.fn()
      };

      global.AudioContext = jest.fn().mockReturnValue(mockAudioContext);
      
      const manager = new SoundManager();
      
      // Should not throw errors even when oscillator creation fails
      expect(() => manager.playPlacePieceSound()).not.toThrow();
      expect(() => manager.playFlipSound()).not.toThrow();
      expect(() => manager.playGameOverSound()).not.toThrow();
    });
  });

  describe('Audio Context States', () => {
    test('should handle suspended audio context', () => {
      const mockResume = jest.fn();
      const mockAudioContext = {
        createOscillator: jest.fn().mockReturnValue({
          connect: jest.fn(),
          start: jest.fn(),
          stop: jest.fn(),
          frequency: {
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn()
          }
        }),
        createGain: jest.fn().mockReturnValue({
          connect: jest.fn(),
          gain: {
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn()
          }
        }),
        destination: {},
        currentTime: 0,
        state: 'suspended',
        resume: mockResume
      };

      global.AudioContext = jest.fn().mockReturnValue(mockAudioContext);
      
      const manager = new SoundManager();
      manager.playPlacePieceSound();
      
      expect(mockResume).toHaveBeenCalled();
    });
  });
});
