import { config } from "./config.js";
import { createLoop } from "./loop.js";
import { createEngine } from "./engine.js";
import { createRenderer } from "./renderer.js";
import { createKeydownHandler } from "./handler.js";
import { updateScore, updateLevel } from "../layout/layout.js";

const canvas = document.getElementById("canvas");

export function startGame() {
  const engine = createEngine(config);
  const renderer = createRenderer(canvas, config);
  const keydownHandler = createKeydownHandler(engine);

  const loop = createLoop(() => {
    const snapshot = engine.tick(config.gridSize);
    renderer.render(snapshot, config.gridSize);
  }, config.startSpeed);

  engine.on("score", (score) => updateScore(score));
  engine.on("level", (level) => {
    updateLevel(level);
    loop.setSpeed(loop.snapshot().speed - config.speedStep);
  });

  loop.start();
  keydownHandler.start();

  return {
    stop() {
      loop.stop();
      keydownHandler.stop();
    },
  };
}
