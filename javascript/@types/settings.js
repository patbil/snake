/** @typedef { import('./config').GameConfig} GameConfig */

/**
 * @typedef {object} SettingsManagerPublicAPI
 * @property {() => object} getSettings - Returns the currently active settings object.
 * @property {(newSettings: object) => void} saveSettings - Saves a subset of settings to localStorage and updates in-memory settings.
 * @property {() => void} restoreSettings - Restores all configurable settings to their default values and clears localStorage.
 * @property {GameConfig} defaultConfig - A deep clone of the default configuration object.
 */

export {};
