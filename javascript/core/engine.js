import { createStateManager } from "./state.js";

/** @typedef {import('../@types/config.js').GameConfig} GameConfig */
/** @typedef {import('../@types/events.js').EventBusPublicAPI} EventBus */
/** @typedef {import('../@types/engine.js').EnginePublicAPI} EnginePublicAPI */

/**
 * Creates the Game Engine module.
 * Controls the game loop, state updates, and interactions with the Event Bus.
 *
 * @param {GameConfig} settings - Game configuration object.
 * @param {EventBus} eventBus - Central Event Bus for emitting state change events.
 * @returns {EnginePublicAPI}
 */
export function createEngine(eventBus, settings) {
    const stateManager = createStateManager(eventBus, settings);
    const gridCount = settings.canvas.grid;

    setDefault();

    function togglePause({ emitEvent }) {
        stateManager.togglePause({ emitEvent });
    }

    function setDefault() {
        stateManager.setDefault();
    }

    function setDirection(dx, dy) {
        const currentDir = stateManager.snapshot().direction;
        if (dx + currentDir.x === 0 && dy + currentDir.y === 0) {
            return;
        }
        stateManager.setDirection(dx, dy);
    }

    function handleCollision() {
        stateManager.gameOver();
        const newState = stateManager.snapshot();
        return newState;
    }

    function handleMovement({ segments, direction }) {
        const newX = (segments[0].x + direction.x + gridCount) % gridCount;
        const newY = (segments[0].y + direction.y + gridCount) % gridCount;

        stateManager.addHead(newX, newY);
        let newState = stateManager.snapshot();

        while (
            newState.segments.length >
            settings.initialSegmentCount + newState.score
        ) {
            stateManager.removeTail();
            newState = stateManager.snapshot();
        }

        return newState;
    }

    function handleConsumption() {
        stateManager.setApple(
            Math.floor(Math.random() * gridCount),
            Math.floor(Math.random() * gridCount)
        );

        stateManager.increaseScore();
        let newState = stateManager.snapshot();

        if (newState.score % settings.levelStep === 0) {
            stateManager.increaseLevel();
            newState = stateManager.snapshot();
        }

        return newState;
    }

    function tick() {
        let state = stateManager.snapshot();
        if (state.direction.x !== 0 || state.direction.y !== 0) {
            state = handleMovement(state);
        }

        const [head, ...body] = state.segments;
        const collision = body.some(
            (segment) => segment.x === head.x && segment.y === head.y
        );
        const consumption =
            head.x === state.apple.x && head.y === state.apple.y;

        if (collision) state = handleCollision();
        if (consumption) state = handleConsumption();

        return {
            segments: state.segments,
            apple: state.apple,
            score: state.score,
            level: state.level,
        };
    }


    return { tick, setDirection, togglePause, setDefault };
}
