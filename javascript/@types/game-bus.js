/** @typedef {import('./event').EventBusPublicAPI} EventBusPublicAPI */
/** @typedef {import('./engine').EnginePublicAPI} EnginePublicAPI */
/** @typedef {import('./loop').LoopPublicAPI} LoopPublicAPI */
/** @typedef {import('./audio').AudioManagerPublicAPI} AudioManagerPublicAPI */
/** @typedef {import('./layout').LayoutManagerPublicAPI} LayoutManagerPublicAPI */
/** @typedef {import('./settings').SettingsManagerPublicAPI} SettingsManagerPublicAPI */
/** @typedef {import('./handler').HandlerPublicAPI} HandlerPublicAPI */


/**
 * Dependencies required by the Game Bus to coordinate game events.
 * The Game Bus acts as a central event coordinator that connects all game modules
 * and orchestrates their interactions through the event system.
 * 
 * @typedef {Object} GameBusDependencies
 * @property {EventBusPublicAPI} eventBus - Event bus for publishing and subscribing to game events
 * @property {EnginePublicAPI} engine - Game engine handling core game logic (movement, collisions, scoring)
 * @property {LoopPublicAPI} loop - Game loop controller managing tick intervals and execution
 * @property {AudioManagerPublicAPI} audioManager - Audio manager for playing sound effects
 * @property {LayoutManagerPublicAPI} layoutManager - Layout manager for updating DOM elements and modals
 * @property {SettingsManagerPublicAPI} settingsManager - Settings manager for persisting and retrieving user preferences
 * @property {HandlerPublicAPI} keydownHandler - Keydown handler for capturing keyboard input
 */

/**
 * Public API of the Game Bus module.
 * The Game Bus is responsible for wiring up all event handlers and coordinating
 * communication between different game modules.
 * 
 * @typedef {Object} GameBusPublicAPI
 * @property {() => void} registerEvents - Registers all core game events and their corresponding handlers.
 */

export {};