/** @typedef {import('../@types/events').GameEvents} GameEvents */

/**
 * Centralized event constants for the Snake Game.
 * Using this ensures consistent event names across the application.
 *
 * @type {GameEvents}
 */
export const EVENTS = {
    MOVE: {
        TOGGLE_PAUSE: "MOVE:TOGGLE_PAUSE",
        CHANGE_DIRECTION: "MOVE:CHANGE_DIRECTION",
    },
    UI: {
        RESTART_REQUESTED: "UI:RESTART_REQUESTED",
        OPEN_MODAL: "UI:OPEN_MODAL",
        SETTINGS: {
            SAVE: "UI:SAVE_SETTINGS",
            RESET: "UI:RESET_SETTINGS",
        },
    },
    STATE: {
        DIRECTION: "STATE:DIRECTION",
        PAUSE: "STATE:PAUSE",
        APPLE: "STATE:APPLE",
        SCORE: "STATE:SCORE_UPDATED",
        LEVEL_UP: "STATE:LEVEL_UP",
        GAME_OVER: "STATE:GAME_OVER",
        SEGMENTS: "STATE:SEGMENTS",
        RESET: "STATE:RESET",
    },
};
