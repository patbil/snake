import { config as defaultConfig } from "./core/config.js";
import { createGame } from "./core/game.js"; // Załóżmy, że ten moduł jest Twoim 'startGame'
import { createAudioManager } from "./core/audio.js";
import { createLayoutManager } from "./layout/layout.js";
import { createSettingsManager } from "./core/settings.js";

window.onload = function () {
    const settingsManager = createSettingsManager(defaultConfig);
    const config = settingsManager.loadSettings();

    const audioManager = createAudioManager(config);
    const layoutManager = createLayoutManager({
        getConfig: settingsManager.getSettings,
        onOpen: () => {
            game.togglePause(false);
        },
        onSave: (newSettings) => {
            settingsManager.saveSettings(newSettings);
        },
        onReset: () => {
            const resetConfig = settingsManager.defaultConfig;
            settingsManager.saveSettings(resetConfig);
            return resetConfig;
        },
    });

    console.log(config)

    const game = createGame({
        layoutManager,
        audioManager,
        config,
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
