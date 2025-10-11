export function createRenderer(canvas, config) {
  const ctx = canvas.getContext("2d");

  function clear() {
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function render(snapshot, gridSize) {
    clear();

    ctx.fillStyle = config.colors.apple;
    ctx.fillRect(
      snapshot.apple.x * gridSize,
      snapshot.apple.y * gridSize,
      gridSize - 4,
      gridSize - 4
    );

    ctx.fillStyle = config.colors.snake;
    snapshot.segments.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 4,
        gridSize - 4
      );
    });
  }

  return { render };
}
