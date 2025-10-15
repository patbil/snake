/** @typedef { import('./config').AudioConfig} AudioConfig */

/**
 * Public API of the Audio Manager.
 * The Audio Manager is responsible for playing sound effects during gameplay.
 * It respects user settings for audio enabled/disabled and volume level.
 * Sounds are loaded from the paths defined in the audio configuration.
 * 
 * @typedef {Object} AudioManager
 * @property {(soundName: keyof Omit<AudioConfig, 'enabled' | 'volume'>) => void} play - Plays a specific sound effect by name.
 */

export {};
