import { createStateManager } from "./state.js";

/**
 * Creates the Game Engine module.
 * This function acts as a controller, orchestrating the game loop ('tick')
 * and managing interactions between the game state and logic.
 *
 * @param {object} settings - The global game settingsuration object.
 * @param {object} eventBus - The central Event Bus used by the engine to emit state change notifications.
 * @returns {object} The public engine interface.
 */
export function createEngine(settings, eventBus) {
    const stateManager = createStateManager(settings, eventBus);
    const gridSize = settings.gridSize;
    let initialized = false;

    function initialize() {
        setDefault();
        initialized = true;
    }

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

    /**
     * Helper to handle collision events (e.g., hitting the body or wall).
     * @returns {object} The state after Game Over reset.
     */
    function handleColision() {
        stateManager.gameOver(); // Resets score, level, segments to default
        const newState = stateManager.snapshot();
        return newState;
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
            settings.initialSegmentCount + newState.score
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

        if (newState.score % settings.levelStep === 0) {
            stateManager.increaseLevel();
            newState = stateManager.snapshot();
        }

        return newState;
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

    return { tick, setDirection, togglePause, setDefault };
}
