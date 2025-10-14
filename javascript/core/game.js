import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { createRenderer } from "./renderer.js";
import { createKeydownHandler } from "./handler.js";
import { createEventBus } from "./event.js";

/**
 * Creates and manages the full lifecycle of the Snake game (start, stop, pause, restart).
 * Maintains encapsulation of the core game state.
 * @param {object} dependencies - Dependencies: layoutManager, audioManager, settings, canvas.
 * @returns {object} The public control interface.
 */
export function createGame({ layoutManager, audioManager, settings, canvas }) {
    const eventBus = createEventBus();
    const engine = createEngine(settings, eventBus);
    const renderer = createRenderer(canvas, settings);
    const keydownHandler = createKeydownHandler(eventBus);

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot, settings.gridSize);
    }, settings.initialSpeed);

    registerEvents();

    /**
     * Starts the game loop and activates key listening.
     * Used for initial start or resuming after a global stop/restart.
     */
    function start() {
        loop.start();
        keydownHandler.start();
    }

    /**
     * Completely stops the loop and deactivates key listening.
     * Used for Game Over or preparing for a clean restart.
     */
    function stop() {
        loop.stop();
        keydownHandler.stop();
    }

    /**
     * Stops the game loop, resets the engine state, and restarts the game.
     * Used for starting a new game after a Game Over or a user-initiated restart.
     */
    function restart() {
        stop();
        engine.setDefault();
        start();
    }

    /**
     * Toggles the pause state in the engine.
     * The engine will emit the 'pause' event, which is handled below.
     */
    function togglePause({ emitEvent }) {
        engine.togglePause({ emitEvent });
    }

    /**
     * Registers all event subscriptions from the core engine to external managers.
     */
    function registerEvents() {
        eventBus.on("pause", handlePause);
        eventBus.on("score", handleScore);
        eventBus.on("level", handleLevel);
        eventBus.on("gameover", handleGameOver);
        eventBus.on("reset", handleReset);
        eventBus.on("COMMAND_PAUSE", togglePause);
        eventBus.on("INPUT_MOVE", handleMove);
    }

    function handleMove(dir) {
        engine.setDirection(dir.x, dir.y);
    }

    function handleReset() {
        layoutManager.resetAll();
    }

    function handlePause(isPaused) {
        layoutManager.togglePause(isPaused);
        isPaused ? loop.stop() : loop.start();
    }

    function handleScore(score) {
        layoutManager.setScore(score);
        audioManager.play("eat");
    }

    function handleLevel(level) {
        layoutManager.setLevel(level);
        audioManager.play("levelup");

        const { speed } = loop.snapshot();
        const newSpeed = Math.max(
            settings.maxSpeed,
            speed - settings.speedStep
        );
        loop.setSpeed(newSpeed);
    }

    function handleGameOver(snapshot) {
        stop();
        layoutManager.gameOver(snapshot);
        audioManager.play("gameover");
    }

    return {
        start,
        stop,
        restart,
        togglePause,
    };
}
