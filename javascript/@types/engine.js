/**
 * Snapshot of the game state at a specific tick.
 * This immutable snapshot represents the visual state of the game and is used by the renderer to draw the current frame.
 * 
 * @typedef {Object} TickSnapshot
 * @property {Array<{x:number,y:number}>} segments - Array of coordinates for each snake segment, ordered from tail to head.
 * @property {{x:number,y:number}} apple - Coordinate of the apple on the game grid.
 * @property {number} score - Current player score.
 * @property {number} level - Current game level.
 */

/**
 * Public API of the Game Engine module.
 * The Engine is responsible for core game logic including snake movement, collision detection, apple spawning, and score/level management.
 * 
 * @typedef {Object} EnginePublicAPI
 * @property {() => TickSnapshot} tick - Executes one game tick: moves the snake, checks collisions,handles apple consumption, and returns the current game state.
 * @property {(x: number, y: number) => void} setDirection - Sets the movement direction of the snake's head.
 * @property {(options: {emitEvent: boolean}) => void} togglePause - Pauses or resumes the game.
 * @property {() => void} setDefault - Resets the game engine to its initial state.
 */

export {};
