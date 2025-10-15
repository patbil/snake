/**
 * Player movement and control events.
 *
 * @typedef {Object} MoveEvents
 * @property {string} TOGGLE_PAUSE - Event to toggle pause state.
 * @property {string} CHANGE_DIRECTION - Event to change snake's movement direction.
 */

/**
 * Leaderboard-related events
 *
 * @typedef {Object} LeaderboardEvents
 * @property {string} UPDATE - Triggered when leaderboard scores are updated.
 * @property {string} FETCH - Triggered when leaderboard data is requested.
 * @property {string} ERROR - Triggered when an error occurs while fetching or updating leaderboard.
 */

/**
 * Settings-related UI events.
 *
 * @typedef {Object} UISettingsEvents
 * @property {string} SAVE - Event to save current settings to localStorage.
 * @property {string} RESET - Event to reset all settings to default values.
 */

/**
 * User interface events.
 *
 * @typedef {Object} UIEvents
 * @property {string} RESTART_REQUESTED - Event triggered when player requests a game restart.
 * @property {string} OPEN_MODAL - Event to open a specific modal window.
 * @property {UISettingsEvents} SETTINGS - Nested settings-related events for the settings modal.
 */

/**
 * Game state change events.
 *
 * @typedef {Object} StateEvents
 * @property {string} DIRECTION - Event emitted when snake's direction changes.
 * @property {string} PAUSE - Event emitted when pause state toggles.
 * @property {string} APPLE - Event emitted when a new apple spawns.
 * @property {string} SCORE - Event emitted when score increases.
 * @property {string} LEVEL_UP - Event emitted when player advances to next level.
 * @property {string} GAME_OVER - Event emitted when game ends (collision detected).
 * @property {string} SEGMENTS - Event emitted when snake segments change.
 * @property {string} RESET - Event to reset the entire game state to initial values.
 */

/**
 * Complete game event structure.
 * Used by the EventBus for type-safe event handling.
 *
 * @typedef {Object} GameEvents
 * @property {StateEvents} STATE
 * @property {UIEvents} UI
 * @property {MoveEvents} MOVE
 * @property {LeaderboardEvents} LEADERBOARD
 */

export {};
