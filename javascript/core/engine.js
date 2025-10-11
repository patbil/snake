import { createStateManager } from "./state.js";

export function createEngine(config, initialized = false) {
  const stateManager = createStateManager(config);

  function initialize() {
    stateManager.setDefault();
    initialized = true;
  }

  function tick() {
    if (!initialized) initialize();

    const gridSize = config.gridSize;
    let before = stateManager.snapshot();
    if (before.direction.x !== 0 || before.direction.y !== 0) {
      let newX = before.segments[0].x + before.direction.x;
      let newY = before.segments[0].y + before.direction.y;

      if (newX < 0) newX = gridSize - 1;
      if (newY < 0) newY = gridSize - 1;
      if (newX > gridSize - 1) newX = 0;
      if (newY > gridSize - 1) newY = 0;

      stateManager.addHead(newX, newY);

      let after = stateManager.snapshot();
      while (after.segments.length > config.startSegmentCount + after.score) {
        stateManager.removeTail();
        after = stateManager.snapshot();
      }
      before = after; // keep latest for subsequent checks
    }

    if (
      before.segments[0].x == before.apple.x &&
      before.segments[0].y == before.apple.y
    ) {
      stateManager.setApple(
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize)
      );

      stateManager.increaseScore();
      const afterScore = stateManager.snapshot().score;
      if (afterScore % config.levelStep === 0) {
        stateManager.increaseLevel();
      }
    }

    const latest = stateManager.snapshot();

    return {
      segments: latest.segments,
      apple: latest.apple,
      score: latest.score,
      level: latest.level,
    };
  }

  function on(name, handler) {
    stateManager.on(name, handler);
  }

  function setDirection(x, y) {
    stateManager.setDirection(x, y);
  }

  function togglePause() {}

  return { tick, setDirection, togglePause, on };
}
