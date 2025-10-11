export function createKeydownHandler(engine) {
  const handler = (e) => {
    switch (e.keyCode) {
      case 32:
        engine.togglePause();
        break;
      case 37:
        engine.setDirection(-1, 0);
        break;
      case 38:
        engine.setDirection(0, -1);
        break;
      case 39:
        engine.setDirection(1, 0);
        break;
      case 40:
        engine.setDirection(0, 1);
        break;
    }
  };

  function start() {
    window.addEventListener("keydown", handler);
  }

  function stop() {
    window.removeEventListener("keydown", handler);
  }

  return { start, stop };
}
