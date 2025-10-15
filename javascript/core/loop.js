/** @typedef {import('../@types/loop').LoopPublicAPI} LoopPublicAPI */

/**
 * Creates the Game Loop module, wrapping setInterval functionality.
 * Provides control over starting, stopping, and changing the loop's speed.
 *
 * @param {() => void} callback - The function to execute cyclically.
 * @param {number} speed - The initial interval (ms) between 'callback' executions.
 * @returns {LoopPublicAPI}
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
    }

    function snapshot() {
        return {
            speed: currentSpeed,
            isRunning: intervalId !== undefined,
        };
    }

    return { start, stop, setSpeed, snapshot };
}
