import { createStateManager } from "./state.js";

/**
 * Creates the Game Engine module.
 * This function acts as a controller, orchestrating the game loop ('tick')
 * and managing interactions between the game state and logic.
 *
 * @param {object} config - The global game configuration object.
 * @returns {object} The public engine interface.
 */
export function createEngine(config) {
    const stateManager = createStateManager(config);
    const gridSize = config.gridSize;
    let initialized = false;

    function initialize() {
        stateManager.setDefault();
        initialized = true;
    }

    /**
     * Helper to handle snake movement, grid wrapping, and length management.
     * @param {object} state - Snapshot of the state before movement.
     * @returns {object} The new state after movement and tail removal.
     */
    function handleMovement({ segments, direction }) {
        const newX = (segments[0].x + direction.x + gridSize) % gridSize;
        const newY = (segments[0].y + direction.y + gridSize) % gridSize;

        stateManager.addHead(newX, newY);
        let newState = stateManager.snapshot();

        while (
            newState.segments.length >
            config.initialSegmentCount + newState.score
        ) {
            stateManager.removeTail();
            newState = stateManager.snapshot();
        }

        return newState;
    }

    /**
     * Helper to handle apple consumption, scoring, and level progression.
     * @returns {object} The new state after consumption and score updates.
     */
    function handleConsumption() {
        stateManager.setApple(
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        );

        stateManager.increaseScore();
        let newState = stateManager.snapshot();

        if (newState.score % config.levelStep === 0) {
            stateManager.increaseLevel();
            newState = stateManager.snapshot();
        }

        return newState;
    }

    /**
     * Helper to handle collision events (e.g., hitting the body or wall).
     * @returns {object} The state after Game Over reset.
     */
    function handleColision() {
        stateManager.gameOver(); // Resets score, level, segments to default
        const newState = stateManager.snapshot();
        return newState;
    }

    function on(name, handler) {
        stateManager.on(name, handler);
    }

    function setDirection(x, y) {
        stateManager.setDirection(x, y);
    }

    function getDirection() {
        return stateManager.snapshot().direction;
    }

    function togglePause() {
        stateManager.togglePause();
    }

    /**
     * The core game loop tick function. Executes one step of the game logic.
     * @returns {object} The essential state data for the renderer.
     */
    function tick() {
        if (!initialized) initialize();

        let state = stateManager.snapshot();

        if (state.direction.x !== 0 || state.direction.y !== 0) {
            state = handleMovement(state);
        }

        const [head, ...body] = state.segments;
        const colision = body.some(
            (segment) => segment.x === head.x && segment.y === head.y
        );
        const consumption =
            head.x === state.apple.x && head.y === state.apple.y;

        if (colision) state = handleColision(state);
        if (consumption) state = handleConsumption();

        return {
            segments: state.segments,
            apple: state.apple,
            score: state.score,
            level: state.level,
        };
    }

    return { on, tick, setDirection, getDirection, togglePause };
}
