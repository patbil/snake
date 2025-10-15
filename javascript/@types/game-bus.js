/** @typedef {import('./event').EventBusPublicAPI} EventBusPublicAPI */
/** @typedef {import('./engine').EnginePublicAPI} EnginePublicAPI */
/** @typedef {import('./loop').LoopPublicAPI} LoopPublicAPI */
/** @typedef {import('./audio').AudioManagerPublicAPI} AudioManagerPublicAPI */
/** @typedef {import('./layout').LayoutManagerPublicAPI} LayoutManagerPublicAPI */
/** @typedef {import('./settings').SettingsManagerPublicAPI} SettingsManagerPublicAPI */

/**
 * @typedef {Object} GameBusDependencies
 * @property {EventBusPublicAPI} eventBus
 * @property {EnginePublicAPI} engine
 * @property {LoopPublicAPI} loop
 * @property {AudioManagerPublicAPI} audioManager
 * @property {LayoutManagerPublicAPI} layoutManager
 * @property {SettingsManagerPublicAPI} settingsManager
 */

/**
 * @typedef {Object} GameBusPublicAPI
 * @property {() => void} registerEvents - Registers all core game events and their corresponding handlers.
 */

export {};