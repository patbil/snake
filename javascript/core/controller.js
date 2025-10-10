import { config } from "./config.js";
import { increaseScore } from "./state.js";
import { getScore } from "./state.js";
import {
  getDirection,
  getApplePosition,
  setApplePosition,
  getSegments,
  setSnakeHead,
  removeSnakeTail,
  setDefault,
} from "./state.js";

let initialized = false;

export function controller(canvas, ctx, gridSize) {
  if (!initialized) {
    setDefault();
    initialized = true;
  }

  const segments = getSegments();
  const direction = getDirection();
  const applePosition = getApplePosition();

  if (direction.x !== 0 || direction.y !== 0) {
    let newX = segments[0].x + direction.x;
    let newY = segments[0].y + direction.y;

    if (newX < 0) newX = gridSize - 1;
    if (newY < 0) newY = gridSize - 1;
    if (newX > gridSize - 1) newX = 0;
    if (newY > gridSize - 1) newY = 0;

    setSnakeHead(newX, newY);

    while (segments.length > config.startSegmentCount + getScore()) {
      removeSnakeTail();
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(
    applePosition.x * gridSize,
    applePosition.y * gridSize,
    gridSize - 4,
    gridSize - 4
  );

  ctx.fillStyle = "red";

  segments.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 4,
      gridSize - 4
    );
  });

  if (segments[0].x == applePosition.x && segments[0].y == applePosition.y) {
    setApplePosition(
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize)
    );

    increaseScore();
  }
}
