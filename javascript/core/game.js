import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { createRenderer } from "./renderer.js";
import { createKeydownHandler } from "./handler.js";

/**
 * Creates and manages the full lifecycle of the Snake game (start, stop, pause, restart).
 * Maintains encapsulation of the core game state.
 * * @param {object} dependencies - Dependencies: layoutManager, audioManager, config, canvas.
 * @returns {object} The public control interface.
 */
export function createGame({ layoutManager, audioManager, config, canvas }) {
    const engine = createEngine(config);
    const renderer = createRenderer(canvas, config);
    const keydownHandler = createKeydownHandler(engine);

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot, config.gridSize);
    }, config.initialSpeed);

    registerEvents();

    /**
     * Starts the game loop and activates key listening.
     * Used for initial start or resuming after a global stop/restart.
     */
    function start() {
        loop.start();
        keydownHandler.start();
        layoutManager.togglePause(false);
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
     * Toggles the pause state in the engine.
     * The engine will emit the 'pause' event, which is handled below.
     */
    function togglePause() {
        engine.togglePause();
    }
    /**
     * Registers all event subscriptions from the core engine to external managers.
     */
    function registerEvents() {
        engine.on("pause", handlePause);
        engine.on("score", handleScore);
        engine.on("level", handleLevel);
        engine.on("gameover", handleGameOver);
    }

    function handlePause(isPaused) {
        layoutManager.togglePause(isPaused);
        isPaused ? loop.pause() : loop.start();
    }

    function handleScore(score) {
        layoutManager.updateScore(score);
        audioManager.play("eat");
    }

    function handleLevel(level) {
        layoutManager.updateLevel(level);
        audioManager.play("levelup");

        const { speed } = loop.snapshot();
        const newSpeed = Math.max(config.maxSpeed, speed - config.speedStep);
        loop.setSpeed(newSpeed);
    }

    function handleGameOver(snapshot) {
        layoutManager.gameOver(snapshot);
        audioManager.play("gameover");
        stop();
    }

    return {
        start,
        stop,
        togglePause,
    };
}
