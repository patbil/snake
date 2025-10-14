import { EVENT_DOMAINS } from "./events-definition.js";

/**
 * Creates the Keydown Handler module.
 * This module listens for global key presses and maps them directly to
 * input commands emitted onto the Event Bus.
 * @param {object} eventBus - The Event Bus interface (must expose the emit method) used to broadcast user input commands.
 * @returns {object} Public interface to start and stop the input listener.
 */
export function createKeydownHandler(eventBus) {
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

    const handler = (event) => {
        const key = event.key;

        if (directionMap[key] || key === " ") {
            event.preventDefault();
        }

        if (key === " ") {
            eventBus.emit(EVENT_DOMAINS.MOVE.TOGGLE_PAUSE, { emitEvent: true });
            return;
        }

        const vector = directionMap[key];
        if (vector) {
            const [x, y] = vector;
            eventBus.emit(EVENT_DOMAINS.MOVE.CHANGE_DIRECTION, { x, y });
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
