/** @typedef {import('./event.js').EventBus} EventBus */
/** @typedef {import('./engine.js').GameEngine} GameEngine */
/** @typedef {import('./loop.js').Loop} Loop */
/** @typedef {import('./audio.js').AudioManager} AudioManager */
/** @typedef {import('./layout.js').LayoutManager} LayoutManager */
/** @typedef {import('./settings.js').SettingsManager} SettingsManager */
/** @typedef {import('./handler.js').KeydownHandler} KeydownHandler */
/** @typedef {import('./score.js').ScoreManager} ScoreManager */

/**
 * Dependencies required by the Game Bus to coordinate game events.
 * The Game Bus acts as a central event coordinator that connects all game modules
 * and orchestrates their interactions through the event system.
 *
 * @typedef {Object} GameBusDependencies
 * @property {EventBus} eventBus - Event bus for publishing and subscribing to game events
 * @property {GameEngine} engine - Game engine handling core game logic (movement, collisions, scoring)
 * @property {Loop} loop - Game loop controller managing tick intervals and execution
 * @property {AudioManager} audioManager - Audio manager for playing sound effects
 * @property {LayoutManager} layoutManager - Layout manager for updating DOM elements and modals
 * @property {SettingsManager} settingsManager - Settings manager for persisting and retrieving user preferences
 * @property {ScoreManager} scoreManager - Score manager for tracking and displaying player scores
 * @property {KeydownHandler} keydownHandler - Keydown handler for capturing keyboard input
 */

/**
 * Public API of the Game Bus module.
 * The Game Bus is responsible for wiring up all event handlers and coordinating
 * communication between different game modules.
 *
 * @typedef {Object} GameBus
 * @property {() => void} registerEvents - Registers all core game events and their corresponding handlers.
 */

export {};
