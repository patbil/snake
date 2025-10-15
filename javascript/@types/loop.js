/**
 * @typedef {Object} LoopPublicAPI
 * @property {() => void} start - Starts the game loop.
 * @property {() => void} stop - Stops the game loop.
 * @property {(newSpeed: number) => void} setSpeed - Changes the interval speed of the loop (in milliseconds).
 * @property {() => {speed: number, isRunning: boolean}} snapshot - Returns the current state of the loop, including the current speed and whether it is running.
 */

export {};