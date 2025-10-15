import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { createGameBus } from "./game-bus.js";
import { createRenderer } from "../ui/renderer.js";
import { createEventBus } from "../events/event.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "../audio/audio.js";
import { createScoreManager } from "../score/score.js";
import { createKeydownHandler } from "../handlers/keydown.js";
import { createSettingsManager } from "../settings/settings.js";
import { createFirebaseManager } from "../firebase/firebase.js";

/** @typedef {import("../@types/game.js").Game} Game */

/**
 * Creates and manages the full lifecycle of the Snake game (start, stop, pause, restart).
 * Encapsulates core game state and handles all interactions between engine, UI, and audio.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
 * @returns {Promise<Game>}
 */
export async function createGame(canvas) {
    const eventBus = createEventBus();
    const settingsManager = createSettingsManager();
    const settings = settingsManager.getSettings();

    const engine = createEngine(eventBus, settings);
    const keydownHandler = createKeydownHandler(eventBus);
    const audioManager = createAudioManager(settings.audio);
    const layoutManager = createLayoutManager(eventBus, settings);
    const renderer = createRenderer(canvas, settings.colors, settings.canvas);

    const firebaseManager = await createFirebaseManager();
    const scoreManager = createScoreManager(eventBus, firebaseManager);

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
        settingsManager,
        keydownHandler,
    });

    gameBus.registerEvents();

    function initialize() {
        const username = localStorage.getItem("username");
        if (username) return gameBus.start(username);
        layoutManager.showUsernameModal().then(gameBus.start);
    }

    return { initialize };
}
