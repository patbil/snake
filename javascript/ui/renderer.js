/** @typedef {import('../types/config').ColorConfig} ColorConfig */
/** @typedef {import('../types/config').CanvasConfig} CanvasConfig */
/** @typedef {import('../types/renderer').RendererPublicAPI} RendererPublicAPI */

/**
 * Creates the Renderer module, responsible for drawing the game state onto a Canvas element.
 *
 * @param {HTMLCanvasElement} canvasElement - The canvas element where the game will be drawn.
 * @param {ColorConfig} colors - Colors configuration for snake, apple, and background.
 * @param {CanvasConfig} canvas - Canvas configuration (size and grid count).
 * @returns {RendererPublicAPI} The public renderer interface.
 */
export function createRenderer(canvasElement, colors, canvas) {
    const ctx = canvasElement.getContext("2d");

    const GRID_GAP = 2;
    const blockSize = Math.ceil(canvas.size / canvas.grid);
    canvasElement.height = canvas.size;
    canvasElement.width = canvas.size;

    function clear() {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.size, canvas.size);
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
