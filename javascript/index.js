import { createGame } from "./core/game.js";
import { createLayoutManager } from "./layout/layout.js";
import { createSettingsManager } from "./core/settings.js";

window.onload = function () {
    const settingsManager = createSettingsManager();
    const settings = settingsManager.getSettings();

    const layoutManager = createLayoutManager({
        getSettings: settingsManager.getSettings,
        onOpen: (type) => {
            if (type === "settings") game.togglePause({ emitEvent: false });
        },
        onSave: (settings) => {
            settingsManager.saveSettings(settings);
            game.restart();
        },
        onReset: () => {
            settingsManager.restoreSettings();
            game.restart();
        },
        onRestart: () => {
            game.restart();
        },
    });

    const game = createGame({
        layoutManager,
        settings,
        canvas: document.getElementById("canvas"),
    });

    const username = localStorage.getItem("username");

    const start = (username) => {
        layoutManager.setUsername(username);
        game.start();
    };

    if (username) {
        start(username);
        return;
    }

    layoutManager
        .showUsernameModal()
        .then((resolvedUsername) => start(resolvedUsername));
};
