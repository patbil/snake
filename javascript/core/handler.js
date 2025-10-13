/**
 * Creates the Keydown Handler module.
 * This module listens for key presses and maps them to game engine actions.
 *
 * @param {object} engine - The game engine interface (must expose togglePause and setDirection).
 * @returns {object} Public interface to start and stop the input listener.
 */
export function createKeydownHandler(engine) {
    const directionMap = {
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        ArrowUp: [0, -1],
        w: [0, -1],
        ArrowRight: [1, 0],
        d: [1, 0],
        ArrowDown: [0, 1],
        s: [0, 1],
    };

    function isOppositeDirection(newDx, newDy, currentDir) {
        return newDx + currentDir.x === 0 && newDy + currentDir.y === 0;
    }

    const handler = (event) => {
        const key = event.key;

        if (directionMap[key] || key === " ") {
            event.preventDefault();
        }

        if (key === " ") {
            engine.togglePause(true);
            return;
        }

        const vector = directionMap[key];
        if (vector) {
            const [newDx, newDy] = vector;
            const currentDir = engine.getDirection();
            if (currentDir && (currentDir.x !== 0 || currentDir.y !== 0)) {
                if (isOppositeDirection(newDx, newDy, currentDir)) {
                    return;
                }
            }

            engine.setDirection(newDx, newDy);
        }
    };

    /**
     * Starts listening for global keydown events.
     */
    function start() {
        window.addEventListener("keydown", handler);
    }

    /**
     * Stops listening for global keydown events.
     */
    function stop() {
        window.removeEventListener("keydown", handler);
    }

    return { start, stop };
}
