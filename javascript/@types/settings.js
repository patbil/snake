/** @typedef { import('./config').GameConfig} GameConfig */

/**
 * Public API of the Settings Manager.
 * The Settings Manager handles persistence of user preferences to localStorage
 * and provides access to current settings.
 *
 * @typedef {object} SettingsManager
 * @property {() => object} getSettings - Returns the currently active settings object.
 * @property {(newSettings: object) => void} saveSettings - Saves a subset of settings to localStorage and updates the in-memory settings.
 * @property {() => void} restoreSettings - Restores all configurable settings to their default values.
 * @property {GameConfig} defaultConfig - A deep clone of the default configuration object.
 */

export {};
