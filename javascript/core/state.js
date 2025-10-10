import { config } from "./config.js";

const state = {
  pause: false,
  score: null,
  level: null,
  segments: [],
  apple: {
    x: null,
    y: null,
  },
  direction: {
    x: null,
    y: null,
  },
};

function getScore() {
  return state.score;
}

function getSegments() {
  return state.segments;
}

function getDirection() {
  return { x: state.direction.x, y: state.direction.y };
}

function getApplePosition() {
  return { x: state.apple.x, y: state.apple.y };
}

function setApplePosition(newX, newY) {
  state.apple.x = newX;
  state.apple.y = newY;
}

function setDirection(newX, newY) {
  state.direction.x = newX;
  state.direction.y = newY;
}

function setSnakeHead(x, y) {
  state.segments.unshift({ x, y });
}

function setDefault() {
  state.pause = false;
  state.level = 0;
  state.score = 0;

  setDirection(0, 0);
  setApplePosition(15, 15);
  Array.from({ length: config.startSegmentCount }).map((_, i) =>
    state.segments.push({ x: 10 - i, y: 10 })
  );
}

function increaseScore() {
  state.score += 1;
}

function increaseLevel() {
  state.level += 1;
}

function removeSnakeTail() {
  state.segments.pop();
}

function changePauseState() {
  state.pause = !state.pause;
}

export {
  getApplePosition,
  getDirection,
  getSegments,
  getScore,
  setApplePosition,
  setDirection,
  setDefault,
  setSnakeHead,
  increaseLevel,
  increaseScore,
  removeSnakeTail,
  changePauseState,
};
