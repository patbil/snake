import { EVENTS } from "../events/events.js";

/** @typedef {import('../types/state').StateConfig} StateConfig */
/** @typedef {import('../types/event').EventBusPublicAPI} EventBusPublicAPI */
/** @typedef {import('../types/state').GameStatePublicAPI} GameStatePublicAPI */

/**
 * State Manager Factory for the Snake game.
 * Encapsulates all game state, manages mutations, and emits events via EventBus.
 *
 * @param {EventBusPublicAPI} eventBus - Event Bus for emitting state changes
 * @param {StateConfig} config - State configuration.
 * @returns {GameStatePublicAPI}
 */
export function createStateManager(
    eventBus,
    { gridCount, initialSegmentCount }
) {
    const state = {
        pause: false,
        score: 0,
        level: 0,
        segments: [],
        direction: { x: 0, y: 0 },
        prevDirection: { x: 0, y: 0 },
        apple: { x: null, y: null },
    };

    function snapshot() {
        return {
            pause: state.pause,
            score: state.score,
            level: state.level,
            apple: { ...state.apple },
            direction: { ...state.direction },
            segments: state.segments.slice(),
        };
    }

    function setDefault() {
        state.level = 0;
        state.score = 0;
        state.pause = false;

        const startPos = Math.floor(gridCount / 2);
        state.segments = Array.from(
            { length: initialSegmentCount },
            (_, i) => ({
                x: startPos - i,
                y: startPos,
            })
        );

        state.direction = { x: 0, y: 0 };
        state.prevDirection = { x: 0, y: 0 };
        state.apple = { x: startPos + 5, y: startPos + 5 };

        eventBus.emit(EVENTS.STATE.RESET, snapshot());
    }

    function addHead(x, y) {
        state.segments.unshift({ x, y });
        eventBus.emit(EVENTS.STATE.SEGMENTS, snapshot());
    }

    function removeTail() {
        state.segments.pop();
        eventBus.emit(EVENTS.STATE.SEGMENTS, snapshot());
    }

    function setDirection(x, y) {
        if (state.pause) return;

        const allowed = [-1, 0, 1];
        const ok = allowed.includes(x) && allowed.includes(y);
        if (!ok) return;

        if (x !== 0 || y !== 0) {
            state.prevDirection = {
                x: state.direction.x,
                y: state.direction.y,
            };
        }

        state.direction = { x, y };
        eventBus.emit(EVENTS.STATE.DIRECTION, { x, y });
    }

    function togglePause({ emitEvent }) {
        state.pause = !state.pause;

        if (state.pause) {
            state.prevDirection = state.direction;
            state.direction = { x: 0, y: 0 };
        } else {
            state.direction = state.prevDirection;
        }

        if (emitEvent) {
            eventBus.emit(EVENTS.STATE.PAUSE, state.pause);
        }
    }

    function setApple(x, y) {
        state.apple = { x, y };
        eventBus.emit(EVENTS.STATE.APPLE, { x, y });
    }

    function increaseScore() {
        state.score += 1;
        eventBus.emit(EVENTS.STATE.SCORE, state.score);
    }

    function increaseLevel() {
        state.level += 1;
        eventBus.emit(EVENTS.STATE.LEVEL_UP, state.level);
    }

    function gameOver() {
        state.pause = true;
        state.direction = { x: 0, y: 0 };
        eventBus.emit(EVENTS.STATE.GAME_OVER, snapshot());
    }

    return {
        snapshot,
        setDefault,
        setDirection,
        togglePause,
        setApple,
        increaseLevel,
        increaseScore,
        gameOver,
        addHead,
        removeTail,
    };
}
