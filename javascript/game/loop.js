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

    function start() {
        if (intervalId) return;
        intervalId = setInterval(callback, currentSpeed);
    }

    function stop() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = undefined;
    }

    function setSpeed(newSpeed) {
        currentSpeed = newSpeed;

        if (intervalId) {
            stop();
            start();
        }
    }

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
