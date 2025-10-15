/**
 * Creates the Renderer module, responsible for drawing the game state onto a Canvas element.
 *
 * @param {HTMLCanvasElement} canvas - The Canvas element where the game will be drawn.
 * @param {object} settings - The settingsuration object (contains colors).
 * @returns {object} The public renderer interface with the 'render' function.
 */
export function createRenderer(canvas, settings) {
    const ctx = canvas.getContext("2d");

    const GRID_GAP = 2;
    const { colors, gridCount, canvasSize } = settings;
    const blockSize = canvasSize / gridCount;
    canvas.height = canvasSize;
    canvas.width = canvasSize;

    function clear() {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawElement(x, y) {
        const canvasX = x * blockSize;
        const canvasY = y * blockSize;

        ctx.fillRect(
            canvasX + GRID_GAP / 2,
            canvasY + GRID_GAP / 2,
            blockSize - GRID_GAP,
            blockSize - GRID_GAP
        );
    }

    /**
     * Rendering function. Clears the canvas and draws the entire game state.
     *
     * @param {object} snapshot - The current game state snapshot (segments, apple).
     * @param {number} gridCount - The pixel size of one unit in the game grid.
     */
    function render(snapshot) {
        clear();

        ctx.fillStyle = colors.apple;
        drawElement(snapshot.apple.x, snapshot.apple.y);

        ctx.fillStyle = colors.snake;
        snapshot.segments.forEach((segment) =>
            drawElement(segment.x, segment.y)
        );
    }

    return { render };
}
