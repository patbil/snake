/**
 * Creates the Game Loop module, wrapping setInterval functionality.
 * It provides control over starting, stopping, and changing the loop's speed.
 *
 * @param {function} callback - The function (e.g., the 'tick' function) to be executed cyclically.
 * @param {number} speed - The initial interval (in milliseconds) between 'callback' calls.
 * @returns {object} The public interface for controlling the loop.
 */
export function createLoop(callback, speed) {
    let intervalId = undefined;
    let currentSpeed = speed;

    /**
     * Starts the game loop by setting up the interval.
     * Does nothing if the loop is already running.
     * @returns {void}
     */
    function start() {
        if (intervalId) return;
        intervalId = setInterval(callback, currentSpeed);
    }

    /**
     * Stops the game loop by clearing the interval.
     * Does nothing if the loop is not running.
     * @returns {void}
     */
    function stop() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = undefined;
    }

    /**
     * Changes the speed of the game loop.
     * If the loop is running, it will be restarted with the new speed.
     * @param {number} newSpeed - The new interval in milliseconds.
     * @returns {void}
     */
    function setSpeed(newSpeed) {
        currentSpeed = newSpeed;

        if (intervalId) {
            stop();
            start();
        }
    }

    /**
     * Returns the current state of the game loop.
     * @returns {{speed: number, isRunning: boolean}} The current speed and running state.
     */
    function snapshot() {
        return {
            speed: currentSpeed,
            isRunning: intervalId !== undefined,
        };
    }

    return {
        start,
        stop,
        setSpeed,
        snapshot,
    };
}
