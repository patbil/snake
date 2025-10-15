/**
 * @typedef {Object} MoveEvents
 * @property {string} TOGGLE_PAUSE - Event to toggle pause.
 * @property {string} CHANGE_DIRECTION - Event to change snake direction.
 */

/**
 * @typedef {Object} UISettingsEvents
 * @property {string} SAVE - Event to save settings.
 * @property {string} RESET - Event to reset settings.
 */

/**
 * @typedef {Object} UIEvents
 * @property {string} RESTART_REQUESTED - Event triggered when a restart is requested.
 * @property {string} OPEN_MODAL - Event to open a modal window.
 * @property {UISettingsEvents} SETTINGS - Nested settings-related events.
 */

/**
 * @typedef {Object} StateEvents
 * @property {string} DIRECTION - Event when direction changes.
 * @property {string} PAUSE - Event when pause state changes.
 * @property {string} APPLE - Event when apple spawns.
 * @property {string} SCORE - Event when score updates.
 * @property {string} LEVEL_UP - Event when player levels up.
 * @property {string} GAME_OVER - Event when game ends.
 * @property {string} SEGMENTS - Event when snake segments change.
 * @property {string} RESET - Event to reset the game state.
 */

/**
 * @typedef {Object} GameEvents
 * @property {StateEvents} STATE
 * @property {UIEvents} UI
 * @property {MoveEvents} MOVE
 */

export {};
