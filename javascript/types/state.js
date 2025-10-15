/**
 * @typedef {Object} TogglePauseOptions
 * @property {boolean} emitEvent - Whether to emit a PAUSE event
 */

/**
 * @typedef {Object} StateConfig
 *  @prop {number} gridCount - Number of cells in each dimension of the grid.
 *  @prop {number} initialSegmentCount - Initial length of the snake.
 */

/**
 * @typedef {Object} StateSnapshot
 * @property {boolean} pause - Whether the game is currently paused.
 * @property {number} score - Current score of the player.
 * @property {number} level - Current level of the game.
 * @property {Position} apple - Current position of the apple on the grid.
 * @property {{x: number, y: number}} direction - Current movement direction of the snake.
 * @property {Array<{x: number, y: number}>} segments - Array of snake segments (head first).
 */

/**
 * Public API of the Game State Manager.
 * Exposes methods to read and manipulate the game state safely.
 *
 * @typedef {Object} GameStatePublicAPI
 * @property {() => StateSnapshot} getSnapshot - Returns a shallow copy of the current game state.
 * @property {(x: number, y: number) => void} setDirection - Updates the snake's movement direction.
 * @property {(options: TogglePauseOptions) => void} togglePause - Toggles the game's pause state; optionally emits a PAUSE event.
 * @property {(x: number, y: number) => void} setApple - Sets a new apple position on the grid.
 * @property {() => void} increaseLevel - Increases the current level by one.
 * @property {() => void} increaseScore - Increments the score by one.
 * @property {() => void} gameOver - Triggers the game over state.
 * @property {(x: number, y: number) => void} addHead - Adds a new head segment to the snake.
 * @property {() => void} removeTail - Removes the tail segment of the snake.
 */

export {};
