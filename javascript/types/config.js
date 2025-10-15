/**
 * @typedef {Object} CanvasConfig
 * @property {number} size - The canvas size in pixels.
 * @property {number} grid - The number of grid cells.
 */

/**
 * @typedef {Object} AudioConfig
 * @property {boolean} enabled - Whether sounds are enabled.
 * @property {number} volume - Volume level (0-1).
 * @property {string} eat - Path to the eat sound.
 * @property {string} gameover - Path to the game over sound.
 * @property {string} levelup - Path to the level up sound.
 */

/**
 * @typedef {Object} ColorConfig
 * @property {string} snake - The snake color.
 * @property {string} apple - The apple color.
 * @property {string} background - The background color.
 * @property {string} gridLine - The grid line color.
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} initialSegmentCount - Initial number of snake segments.
 * @property {number} initialSpeed - Initial game loop speed in milliseconds.
 * @property {number} maxSpeed - Minimum interval (maximum speed) in milliseconds.
 * @property {number} levelStep - Score required to advance one level.
 * @property {number} speedStep - Amount speed decreases per level in milliseconds.
 * @property {CanvasConfig} canvas - Canvas configuration.
 * @property {AudioConfig} audio - Audio configuration.
 * @property {ColorConfig} colors - Game colors.
 */

export {};
