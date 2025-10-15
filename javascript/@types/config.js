/**
 * Canvas rendering configuration.
 * 
 * @typedef {Object} CanvasConfig
 * @property {number} size - The canvas size in pixels (width and height).
 * @property {number} grid - The number of grid cells per side.
 */

/**
 * Audio configuration.
 * 
 * @typedef {Object} AudioConfig
 * @property {boolean} enabled - Whether sound effects are enabled.
 * @property {number} volume - Volume level from 0 (mute) to 1 (full volume).
 * @property {string} eat - File path to the sound played when snake eats an apple.
 * @property {string} gameover - File path to the sound played when game ends.
 * @property {string} levelup - File path to the sound played when player levels up.
 */

/**
 * Color scheme configuration.
 * 
 * @typedef {Object} ColorConfig
 * @property {string} snake - The color of the snake segments. Example: '#4CAF50' (green)
 * @property {string} apple - The color of the apple. Example: '#F44336' (red)
 * @property {string} background - The background color of the canvas. Example: '#1a1a1a' (dark gray)
 * @property {string} gridLine - The color of the grid lines. Example: '#333333' (light gray)
 */

/**
 * Complete game configuration.
 * This is the root configuration object that contains all game settings.
 * 
 * @typedef {Object} GameConfig
 * @property {number} initialSegmentCount - Initial number of snake segments when game starts.
 * @property {number} speed - Game loop speed in milliseconds.
 * @property {number} maxSpeed - Minimum interval (maximum speed) in milliseconds.
 * @property {number} levelStep - Score points required to advance one level.
 * @property {number} speedStep - Amount speed decreases per level in milliseconds.
 * @property {CanvasConfig} canvas - Canvas rendering configuration.
 * @property {AudioConfig} audio - Audio configuration.
 * @property {ColorConfig} colors - Color scheme configuration.
 */

export {};
