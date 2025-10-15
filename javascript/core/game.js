import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { EVENTS } from "../events/events.js";
import { createEventBus } from "../events/event.js";
import { createRenderer } from "../ui/renderer.js";
import { createKeydownHandler } from "../handler/handler.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "../audio/audio.js";
import { createSettingsManager } from "../settings/settings.js";

/** @typedef {import("../types/game").GamePublicAPI} GamePublicAPI */

/**
 * Creates and manages the full lifecycle of the Snake game (start, stop, pause, restart).
 * Encapsulates core game state and handles all interactions between engine, UI, and audio.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
 * @returns {GamePublicAPI}
 */
export function createGame(canvas) {
    const eventBus = createEventBus();
    const settingsManager = createSettingsManager();
    const settings = settingsManager.getSettings();

    const engine = createEngine(settings, eventBus);
    const renderer = createRenderer(canvas, settings.colors, settings.canvas);
    const audioManager = createAudioManager(settings.audio);
    const keydownHandler = createKeydownHandler(eventBus);
    const layoutManager = createLayoutManager({ settings, eventBus });

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot);
    }, settings.initialSpeed);

    registerEvents();

    function initialize() {
        const username = localStorage.getItem("username");
        if (username) return start(username);

        layoutManager.showUsernameModal().then(start);
    }

    function start(username) {
        loop.start();
        keydownHandler.start();
        if (username) layoutManager.setUsername(username);
    }

    function stop() {
        loop.stop();
        keydownHandler.stop();
    }

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

    function handleMovePause({ emitEvent }) {
        engine.togglePause({ emitEvent });
    }

    function handleStatePause(isPaused) {
        layoutManager.togglePauseModal(isPaused);
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
        layoutManager.showGameOverModal(snapshot);
        audioManager.play("gameover");
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

    return {
        initialize,
    };
}
