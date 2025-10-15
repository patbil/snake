import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { EVENTS } from "../event/events.js";
import { createEventBus } from "../event/event.js";
import { createRenderer } from "../ui/renderer.js";
import { createKeydownHandler } from "./handler.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "../audio/audio.js";
import { createSettingsManager } from "../settings/settings.js";

/**
 * Creates and manages the full lifecycle of the Snake game (start, stop, pause, restart).
 * Maintains encapsulation of the core game state.
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
 * @returns {object} The public control interface { initialize }.
 */
export function createGame(canvas) {
    const eventBus = createEventBus();
    const settingsManager = createSettingsManager();
    const settings = settingsManager.getSettings();

    const engine = createEngine(settings, eventBus);
    const renderer = createRenderer(canvas, settings);
    const audioManager = createAudioManager(settings);
    const keydownHandler = createKeydownHandler(eventBus);
    const layoutManager = createLayoutManager({
        settings: settings,
        eventBus,
    });

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot);
    }, settings.initialSpeed);

    registerEvents();

    function initialize() {
        const username = localStorage.getItem("username");

        if (username) {
            return start(username);
        }

        layoutManager.showUsernameModal().then(start);
    }

    /**
     * Starts the game loop and activates key listening.
     * Used for initial start or resuming after a global stop/restart.
     */
    function start(username) {
        loop.start();
        keydownHandler.start();
        if (username) {
            layoutManager.setUsername(username);
        }
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

    function registerEvents() {
        eventBus.on(EVENTS.MOVE.TOGGLE_PAUSE, handleMovePause);
        eventBus.on(EVENTS.MOVE.CHANGE_DIRECTION, handleMove);

        eventBus.on(EVENTS.STATE.PAUSE, handleStatePause);
        eventBus.on(EVENTS.STATE.SCORE, handleScore);
        eventBus.on(EVENTS.STATE.LEVEL_UP, handleLevel);
        eventBus.on(EVENTS.STATE.GAME_OVER, handleGameOver);
        eventBus.on(EVENTS.STATE.RESET, handleReset);

        eventBus.on(EVENTS.UI.SETTINGS.SAVE, handleSettingsSave);
        eventBus.on(EVENTS.UI.SETTINGS.RESET, handleSettingsReset);
        eventBus.on(EVENTS.UI.OPEN_MODAL, handleModalOpen);
        eventBus.on(EVENTS.UI.RESTART_REQUESTED, handleRestartRequested);
    }

    function handleMove(dir) {
        engine.setDirection(dir.x, dir.y);
    }

    function handleReset() {
        layoutManager.resetAll();
    }

    function handleSettingsSave(newSettings) {
        settingsManager.saveSettings(newSettings);
        restart();
    }

    function handleSettingsReset() {
        settingsManager.restoreSettings();
        restart();
    }

    function handleModalOpen({ type }) {
        if (type !== "settings") return;
        engine.togglePause({ emitEvent: false });
    }

    function handleRestartRequested() {
        restart();
    }

    function handleStatePause(isPaused) {
        layoutManager.togglePauseModal(isPaused);
        isPaused ? loop.stop() : loop.start();
    }

    function handleMovePause({ emitEvent }) {
        engine.togglePause({ emitEvent });
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
        layoutManager.showGameOverModal(snapshot);
        audioManager.play("gameover");
    }

    return {
        initialize,
    };
}
