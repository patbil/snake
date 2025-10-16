import { EVENTS } from "../events/events.js";

/** @typedef {import("../@types/game-bus.js").GameBus} GameBus */
/** @typedef {import("../@types/game-bus.js").GameBusDependencies} GameBusDependencies */

/**
 * Module that binds events emitted by the Engine and UI
 * to the corresponding actions executed by the Renderer, AudioManager, and Loop.
 * @param {GameBusDependencies} dependencies
 * @returns {GameBus}
 */
export function createGameBus({
    eventBus,
    engine,
    loop,
    audioManager,
    layoutManager,
    settingsManager,
    scoreManager,
    keydownHandler,
}) {
    const settings = settingsManager.getSettings();

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

    async function handleGameOver(snapshot) {
        stop();
        audioManager.play("gameover");
        layoutManager.showGameOverModal(snapshot);
        await scoreManager.addScore({
            level: snapshot.level,
            score: snapshot.score,
        });
    }

    function handleReset() {
        layoutManager.resetAll();
    }

    function handleSettingsSave(newSettings) {
        settingsManager.saveSettings(newSettings);
        eventBus.emit(EVENTS.UI.RESTART_REQUESTED);
    }

    function handleSettingsReset() {
        settingsManager.restoreSettings();
        eventBus.emit(EVENTS.UI.RESTART_REQUESTED);
    }

    function handleModalOpen({ type }) {
        if (type !== "settings") return;
        engine.togglePause({ emitEvent: false });
    }

    function handleLeaderboardUpdate(scores) {
        layoutManager.renderLeaderboard(scores);
    }

    function handleLeaderboardError(error) {
        layoutManager.showLeaderboardError(error.message || error);
    }

    function registerEvents() {
        eventBus.on(EVENTS.MOVE.TOGGLE_PAUSE, handleMovePause);
        eventBus.on(EVENTS.MOVE.CHANGE_DIRECTION, handleMove);

        eventBus.on(EVENTS.LEADERBOARD.ERROR, handleLeaderboardError);
        eventBus.on(EVENTS.LEADERBOARD.UPDATE, handleLeaderboardUpdate);

        eventBus.on(EVENTS.UI.SETTINGS.SAVE, handleSettingsSave);
        eventBus.on(EVENTS.UI.SETTINGS.RESET, handleSettingsReset);
        eventBus.on(EVENTS.UI.OPEN_MODAL, handleModalOpen);
        eventBus.on(EVENTS.UI.RESTART_REQUESTED, restart);

        eventBus.on(EVENTS.STATE.PAUSE, handleStatePause);
        eventBus.on(EVENTS.STATE.SCORE, handleScore);
        eventBus.on(EVENTS.STATE.LEVEL_UP, handleLevel);
        eventBus.on(EVENTS.STATE.GAME_OVER, handleGameOver);
        eventBus.on(EVENTS.STATE.RESET, handleReset);
    }

    return { registerEvents, start };
}
