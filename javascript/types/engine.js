/**
 * @typedef {Object} TickSnapshot
 * @property {Array<{x:number,y:number}>} segments - array of coordinates for each segment in order from tail to head
 * @property {{x:number,y:number}} apple - coordinate of an apple
 * @property {number} score - current score
 * @property {number} level - current level
 */

/**
 * @typedef EngineConfig
 * @property {number} gridCount - Number of grids on the playing field. Defaults to 20.
 * @property {number} initialSegmentCount - Initial length of the snake. Defaults to 3.
 * @property {number} levelStep - Score increment required to advance a level. Defaults to 5.
 */

/**
 * @typedef {Object} EnginePublicAPI
 * @property {() => TickSnapshot} tick - Returns the current game state snapshot.
 * @property {(x: number, y: number) => void} setDirection - Sets the direction of the snake's head.
 * @property {(options: {emitEvent: boolean}) => void} togglePause - Pauses or resumes the game.
 * @property {() => void} setDefault - Resets the game to default settings.
 */

export {};
