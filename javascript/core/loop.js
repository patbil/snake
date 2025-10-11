export function createLoop(callback, speed) {
  let interval = undefined;
  let currentSpeed = speed;

  function start() {
    if (interval) return;
    interval = setInterval(callback, currentSpeed);
  }

  function stop() {
    if (!interval) return;
    clearInterval(interval);
    interval = undefined;
  }

  function setSpeed(s) {
    currentSpeed = s;
    if (interval) {
      stop();
      start();
    }
  }

  function snapshot() {
    return { speed: currentSpeed };
  }

  return { start, stop, setSpeed, snapshot };
}
