/** @typedef { import('./config').AudioConfig} AudioConfig */

/**
 * @typedef {Object} AudioManagerPublicAPI
 * @property {(soundName: keyof Omit<AudioConfig, 'enabled' | 'volume'>) => void} play - Plays a specific sound effect.
 */

export {};
