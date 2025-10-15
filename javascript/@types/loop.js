/**
 * Public API of the Game Loop Controller.
 * The Loop is responsible for executing the game tick at regular intervals.
 * It controls the game's frame rate and can be started, stopped, or adjusted
 * dynamically based on game level or user settings.
 *
 * @typedef {Object} LoopPublicAPI
 * @property {() => void} start - Starts the game loop. Begins calling the tick callback at the configured interval.
 * @property {() => void} stop - Stops the game loop. Clears the interval timer and prevents further tick callbacks.
 * @property {(newSpeed: number) => void} setSpeed - Changes the interval speed of the loop.
 * @property {() => {speed: number, isRunning: boolean}} snapshot - Returns the current state of the loop.
 *
 */

export {};
