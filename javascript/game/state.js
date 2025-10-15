import { EVENTS } from "../event/events.js";

/**
 * State Manager Factory for the Snake game.
 * Encapsulates all game state, manages mutations, and utilizes the Event Emitter pattern.
 *
 * @param {object} settings - Game settingsuration object (e.g., initialSegmentCount).
 * @returns {object} The public State Manager interface.
 */
export function createStateManager(settings, eventBus) {
    const state = {
        pause: false,
        score: 0,
        level: 0,
        segments: [],
        direction: { x: 0, y: 0 },
        prevDirection: { x: 0, y: 0 },
        apple: { x: null, y: null },
    };

    /**
     * Returns a safe, shallow copy of the current game state .
     * This protects the internal 'state' object from external mutation.
     */
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

    /**
     * Resets the game state to default values.
     * Initializes snake position, direction, apple, score, and level.
     * Emits a RESET event.
     * @returns {void}
     */
    function setDefault() {
        state.level = 0;
        state.score = 0;
        state.pause = false;

        const startPos = Math.floor(settings.canvas.grid / 2);
        state.segments = Array.from(
            { length: settings.initialSegmentCount },
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

    /**
     * Adds a new head segment to the snake.
     * Emits a SEGMENTS event.
     * @param {number} x - The x coordinate of the new head.
     * @param {number} y - The y coordinate of the new head.
     * @returns {void}
     */
    function addHead(x, y) {
        state.segments.unshift({ x, y });
        eventBus.emit(EVENTS.STATE.SEGMENTS, snapshot());
    }

    /**
     * Removes the tail segment from the snake.
     * Emits a SEGMENTS event.
     * @returns {void}
     */
    function removeTail() {
        state.segments.pop();
        eventBus.emit(EVENTS.STATE.SEGMENTS, snapshot());
    }

    /**
     * Sets the snake's movement direction.
     * Validates the direction values and prevents changes while paused.
     * Emits a DIRECTION event.
     * @param {number} x - The x direction (-1, 0, or 1).
     * @param {number} y - The y direction (-1, 0, or 1).
     * @returns {void}
     */
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

    /**
     * Toggles the pause state of the game.
     * Saves and restores the direction when pausing/resuming.
     * Optionally emits a PAUSE event.
     * @param {object} options - Toggle options.
     * @param {boolean} options.emitEvent - Whether to emit the PAUSE event.
     * @returns {void}
     */
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

    /**
     * Sets the apple position.
     * Emits an APPLE event.
     * @param {number} x - The x coordinate of the apple.
     * @param {number} y - The y coordinate of the apple.
     * @returns {void}
     */
    function setApple(x, y) {
        state.apple = { x, y };
        eventBus.emit(EVENTS.STATE.APPLE, { x, y });
    }

    /**
     * Increases the score by 1.
     * Emits a SCORE event.
     * @returns {void}
     */
    function increaseScore() {
        state.score += 1;
        eventBus.emit(EVENTS.STATE.SCORE, state.score);
    }

    /**
     * Increases the level by 1.
     * Emits a LEVEL_UP event.
     * @returns {void}
     */
    function increaseLevel() {
        state.level += 1;
        eventBus.emit(EVENTS.STATE.LEVEL_UP, state.level);
    }

    /**
     * Triggers the game over state.
     * Pauses the game, stops movement, and emits a GAME_OVER event.
     * @returns {void}
     */
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
