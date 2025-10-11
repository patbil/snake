export function createStateManager(config) {
  const listeners = new Map();
  const state = {
    pause: false,
    score: 0,
    level: 0,
    segments: [],
    apple: { x: null, y: null },
    direction: { x: null, y: null },
  };

  function on(name, handler) {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(handler);
  }

  function off(name, handler) {
    listeners.get(name)?.delete(handler);
  }

  function emit(name, payload) {
    const listener = listeners.get(name);
    if (!listener) return;
    for (const handler of Array.from(listener)) handler(payload);
  }

  function snapshot() {
    return {
      pause: state.pause,
      score: state.score,
      level: state.level,
      segments: state.segments.slice(),
      apple: { ...state.apple },
      direction: { ...state.direction },
    };
  }

  function setDefault() {
    state.level = 0;
    state.score = 0;
    state.pause = false;
    state.segments = Array.from(
      { length: config.startSegmentCount },
      (_, i) => ({
        x: 10 - i,
        y: 10,
      })
    );
    state.direction = { x: 0, y: 0 };
    state.apple = { x: 15, y: 15 };
    emit("reset", snapshot());
  }

  function setDirection(newX, newY) {
    const allowed = [-1, 0, 1];
    const ok = allowed.includes(newX) && allowed.includes(newY);
    if (!ok) return;

    state.direction.x = newX;
    state.direction.y = newY;
    emit("direction", { x: newX, y: newY });
  }

  function setApple(newX, newY) {
    state.apple.x = newX;
    state.apple.y = newY;
    emit("apple", { x: newX, y: newY });
  }

  function increaseScore() {
    state.score += 1;
    emit("score", state.score);
  }

  function increaseLevel() {
    state.level += 1;
    emit("level", state.level);
  }

  function addHead(newX, newY) {
    state.segments.unshift({ x: newX, y: newY });
    emit("state", snapshot());
  }

  function removeTail() {
    state.segments.pop();
    emit("state", snapshot());
  }

  return {
    on,
    off,
    emit,
    snapshot,
    setDefault,
    setDirection,
    setApple,
    increaseLevel,
    increaseScore,
    addHead,
    removeTail,
  };
}
