import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { EVENTS } from "../events/events.js";
import { createRenderer } from "../ui/renderer.js";
import { createEventBus } from "../events/event.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "../audio/audio.js";
import { createGameBus } from "./game-bus.js";
import { createKeydownHandler } from "../handlers/keydown.js";
import { createSettingsManager } from "../settings/settings.js";


/** @typedef {import("../@types/game.js").GamePublicAPI} GamePublicAPI */

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

    const engine = createEngine(eventBus, settings);
    const keydownHandler = createKeydownHandler(eventBus);
    const audioManager = createAudioManager(settings.audio);
    const layoutManager = createLayoutManager(eventBus, settings);
    const renderer = createRenderer(canvas, settings.colors, settings.canvas);

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot);
    }, settings.speed);

    const gameBus = createGameBus({
        eventBus,
        engine,
        loop,
        layoutManager,
        audioManager,
        settingsManager
    });

    gameBus.registerEvents();

    eventBus.on(EVENTS.STATE.GAME_OVER, stop);
    eventBus.on(EVENTS.UI.RESTART_REQUESTED, restart);

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
        loop.setSpeed(settings.speed);
        start();
    }

    return {
        initialize,
    };
}