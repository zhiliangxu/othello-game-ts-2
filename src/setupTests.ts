// Test setup file for Jest
import '@testing-library/jest-dom';

// Mock Web Audio API for tests
global.AudioContext = jest.fn().mockImplementation(() => ({
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
  state: 'running',
  resume: jest.fn()
}));

// Mock window.webkitAudioContext
(global as any).webkitAudioContext = global.AudioContext;
