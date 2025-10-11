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

  function speedUp(time) {
    setSpeed(currentSpeed - time);
  }

  function setSpeed(s) {
    currentSpeed = s;
    if (interval) {
      stop();
      start();
    }
  }

  return { start, stop, setSpeed, speedUp };
}
