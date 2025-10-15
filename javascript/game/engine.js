import { createStateManager } from "./state.js";

/**
 * Creates the Game Engine module.
 * This function acts as a controller, orchestrating the game loop ('tick')
 * and managing interactions between the game state and logic.
 *
 * @param {object} settings - The global game settingsuration object.
 * @param {number} settings.canvas.grid - The count of the game grid.
 * @param {number} settings.initialSegmentCount - The starting length of the snake.
 * @param {number} settings.levelStep - Score threshold to increase level.
 * @param {object} eventBus - The central Event Bus used by the engine to emit state change notifications.
 * @returns {object} The public engine interface with game control methods.
 */
export function createEngine(settings, eventBus) {
    const stateManager = createStateManager(settings, eventBus);
    const gridCount = settings.canvas.grid;
    let initialized = false;

    /**
     * Initializes the game engine to its default state.
     */
    function initialize() {
        setDefault();
        initialized = true;
    }

    /**
     * Toggles the pause state of the game.
     * @param {object} options
     * @param {boolean} options.emitEvent - Whether to emit the pause/resume event.
     */
    function togglePause({ emitEvent }) {
        stateManager.togglePause({ emitEvent });
    }

    /**
     * Resets the game state to its default values.
     */
    function setDefault() {
        stateManager.setDefault();
    }

    /**
     * Updates the snake's movement direction.
     * Prevents reversing directly into itself.
     * @param {number} dx - X direction (-1, 0, 1).
     * @param {number} dy - Y direction (-1, 0, 1).
     */
    function setDirection(dx, dy) {
        const currentDir = stateManager.snapshot().direction;
        if (dx + currentDir.x === 0 && dy + currentDir.y === 0) {
            return;
        }
        stateManager.setDirection(dx, dy);
    }

    /**
     * Handles collision events (snake hitting itself or walls).
     * Resets the game state on collision.
     * @returns {object} The state after Game Over reset.
     */
    function handleColision() {
        stateManager.gameOver(); // Resets score, level, segments to default
        const newState = stateManager.snapshot();
        return newState;
    }

    /**
     * Handles snake movement, grid wrapping, and tail removal.
     * @param {object} state - Snapshot of the current game state.
     * @param {Array<{x: number, y: number}>} state.segments - Current snake segments.
     * @param {object} state.direction - Current movement direction.
     * @param {number} state.direction.x - X movement (-1, 0, 1).
     * @param {number} state.direction.y - Y movement (-1, 0, 1).
     * @returns {object} Updated game state after movement.
     */
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

    /**
     * Handles apple consumption, scoring, and level progression.
     * Updates apple position, score, and potentially level.
     * @returns {object} Updated game state after consumption.
     */
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

    /**
     * Executes one tick of the game loop.
     * Handles movement, collisions, apple consumption, and state updates.
     * @returns {object} The minimal state needed for rendering:
     *  - segments: Array of snake segments
     *  - apple: Position of the apple
     *  - score: Current score
     *  - level: Current level
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
