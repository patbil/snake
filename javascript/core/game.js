import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { EVENTS } from "../events/events.js";
import { createEventBus } from "../events/event.js";
import { createRenderer } from "../ui/renderer.js";
import { createKeydownHandler } from "../handler/keydown.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "../audio/audio.js";
import { createSettingsManager } from "../settings/settings.js";
import { createGameEventHandler } from "./game-handler.js";

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

    const keydownHandler = createKeydownHandler(eventBus);
    const audioManager = createAudioManager(settings.audio);
    const layoutManager = createLayoutManager({ settings, eventBus });
    const renderer = createRenderer(canvas, settings.colors, settings.canvas);

    const engine = createEngine(eventBus, {
        gridCount: settings.canvas.grid,
        initialSegmentCount: settings.initialSegmentCount,
    });

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot);
    }, settings.initialSpeed);

    const eventHandler = createGameEventHandler({
        eventBus,
        engine,
        loop,
        layoutManager,
        settingsManager,
        audioManager,
    });

    eventHandler.registerEvents();

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
        start();
    }

    return {
        initialize,
    };
}
