import { EVENTS } from "../event/events.js";

/** @typedef {import('../types/event').EventBusPublicAPI} EventBus */
/** @typedef {import('../types/handler').HandlerPublicAPI} HandlerPublicAPI */

/**
 * Creates the Keydown Handler module.
 * Listens for global key presses and maps them to input commands emitted onto the Event Bus.
 *
 * @param {EventBus} eventBus - Event Bus used to broadcast user input commands.
 * @returns {HandlerPublicAPI}
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

        if (directionMap[key] || key === " ") event.preventDefault();

        if (key === " ") {
            eventBus.emit(EVENTS.MOVE.TOGGLE_PAUSE, { emitEvent: true });
            return;
        }

        const vector = directionMap[key];
        if (vector) {
            const [x, y] = vector;
            eventBus.emit(EVENTS.MOVE.CHANGE_DIRECTION, { x, y });
        }
    };

    function start() {
        window.addEventListener("keydown", handler);
    }

    function stop() {
        window.removeEventListener("keydown", handler);
    }

    return { start, stop };
}
