import { config } from "./config.js";
import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { createRenderer } from "./renderer.js";
import { createKeydownHandler } from "./handler.js";
import { createLayoutManager } from "../ui/layout.js";
import { createAudioManager } from "./sound.js";

const canvas = document.getElementById("canvas");

function setupSubscriptions(engine, loop, layoutManager, soundManager) {
    engine.on("pause", (pause) => layoutManager.togglePause(pause));

    engine.on("score", (score) => {
        layoutManager.updateScore(score);
        soundManager.play("eat");
    });

    engine.on("gameover", (snapshot) => {
        layoutManager.gameOver(snapshot);
        soundManager.play("gameover");
    });

    engine.on("level", (level) => {
        layoutManager.updateLevel(level);
        soundManager.play("levelup");

        const currentSpeed = loop.snapshot().speed;
        const newSpeed = Math.max(
            config.maxSpeed,
            currentSpeed - config.speedStep
        );
        loop.setSpeed(newSpeed);
    });
}

export function startGame() {
    const engine = createEngine(config);
    const renderer = createRenderer(canvas, config);
    const layoutManager = createLayoutManager();
    const soundManager = createAudioManager(config);
    const keydownHandler = createKeydownHandler(engine);

    const loop = createLoop(() => {
        const snapshot = engine.tick();
        renderer.render(snapshot, config.gridSize);
    }, config.initialSpeed);

    setupSubscriptions(engine, loop, layoutManager, soundManager);

    loop.start();
    keydownHandler.start();

    return {
        stop() {
            loop.stop();
            keydownHandler.stop();
        },
    };
}
