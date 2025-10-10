let interval = undefined;

export function loop(callback, speed) {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }

  interval = setInterval(callback, speed);
}
