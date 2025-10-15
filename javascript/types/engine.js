/**
 * @typedef {Object} TickSnapshot
 * @property {Array<{x:number,y:number}>} segments - array of coordinates for each segment in order from tail to head
 * @property {{x:number,y:number}} apple - coordinate of an apple
 * @property {number} score - current score
 * @property {number} level - current level
 */

/**
 * @typedef {Object} EnginePublicAPI
 * @property {() => TickSnapshot} tick - Returns the current game state snapshot.
 * @property {(x: number, y: number) => void} setDirection - Sets the direction of the snake's head.
 * @property {() => void} togglePause - Pauses or resumes the game.
 * @property {() => void} setDefault - Resets the game to default settings.
 */

export {};
