import { config } from "./core/config.js";
import { createGame } from "./core/game.js";
import { createAudioManager } from "./core/sound.js";
import { createLayoutManager } from "./ui/layout.js";

window.onload = function () {
    const layoutManager = createLayoutManager();
    const audioManager = createAudioManager(config);
    const game = createGame({
        layoutManager,
        audioManager,
        config,
        canvas: document.getElementById("canvas"),
    });

    game.start();
};
