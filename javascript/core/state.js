/**
 * State Manager Factory for the Snake game.
 * Encapsulates all game state, manages mutations, and utilizes the Event Emitter pattern.
 *
 * @param {object} settings - Game settingsuration object (e.g., gridSize, initialSegmentCount).
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

    function setDefault() {
        state.level = 0;
        state.score = 0;
        state.pause = false;

        const startPos = Math.floor(settings.gridSize / 2);
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

        eventBus.emit("reset", snapshot());
    }

    function addHead(x, y) {
        state.segments.unshift({ x, y });
        eventBus.emit("state", snapshot());
    }

    function removeTail() {
        state.segments.pop();
        eventBus.emit("state", snapshot());
    }

    function setDirection(x, y) {
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
        eventBus.emit("direction", { x, y });
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
            eventBus.emit("pause", state.pause);
        }
    }

    function setApple(x, y) {
        state.apple = { x, y };
        eventBus.emit("apple", { x, y });
    }

    function increaseScore() {
        state.score += 1;
        eventBus.emit("score", state.score);
    }

    function increaseLevel() {
        state.level += 1;
        eventBus.emit("level", state.level);
    }

    function gameOver() {
        setDefault();
        eventBus.emit("gameover", snapshot());
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
