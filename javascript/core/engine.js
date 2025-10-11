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
    const events = { appleEaten: false, levelUp: false };

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

    // check apple collision using latest state snapshot
    if (
      before.segments[0].x == before.apple.x &&
      before.segments[0].y == before.apple.y
    ) {
      stateManager.setApple(
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize)
      );

      stateManager.increaseScore();
      events.appleEaten = true;

      const afterScore = stateManager.snapshot().score;
      if (afterScore % config.levelStep === 0) {
        stateManager.increaseLevel();
        events.levelUp = true;
      }
    }

    const latest = stateManager.snapshot();
    const snapshot = {
      segments: latest.segments,
      apple: latest.apple,
      score: latest.score,
      level: latest.level,
    };

    return { snapshot, events };
  }

  function setDirection(x, y) {
    stateManager.setDirection(x, y);
  }

  function togglePause() {}

  return { tick, setDirection, togglePause };
}
