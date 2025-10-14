import { createGame } from "./core/game.js";
import { createAudioManager } from "./core/audio.js";
import { createLayoutManager } from "./layout/layout.js";
import { createSettingsManager } from "./core/settings.js";

window.onload = function () {
    const settingsManager = createSettingsManager();
    const settings = settingsManager.getSettings();
    const audioManager = createAudioManager(settings);
    const layoutManager = createLayoutManager({
        getSettings: settingsManager.getSettings,
        onOpen: (type) => {
            if (type === 'settings') game.togglePause({ emitEvent: true })
        },
        onSave: (settings) => {
            settingsManager.saveSettings(settings);
            game.restart();
        },
        onReset: () => {
            settingsManager.saveSettings(settingsManager.defaultConfig);
            game.restart();
        },
    });

    const game = createGame({
        layoutManager,
        audioManager,
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
