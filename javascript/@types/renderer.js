/** @typedef { import('./engine').TickSnapshot} TickSnapshot */

/**
 * Public API of the Canvas Renderer.
 * The Renderer is responsible for drawing the game state onto an HTML5 canvas.
 *
 * @typedef {Object} Renderer
 * @property {(snapshot: TickSnapshot) => void} render - Renders the current game state onto the canvas.
 */

export {};
