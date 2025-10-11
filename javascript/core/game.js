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
  
  keydownHandler.start();

  const loop = createLoop(() => {
    const { snapshot, events } = engine.tick(config.gridSize);
    renderer.render(snapshot, config.gridSize);

    if (events.appleEaten) updateScore(snapshot.score);
    if (events.levelUp) {
      updateLevel(snapshot.level);
      loop.speedUp(config.speedStep)
    }
  }, config.startSpeed);

  loop.start();

  return {
    stop() {
      loop.stop();
      keydownHandler.stop();
    },
  };
}
