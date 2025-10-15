/**
 * Initializes the Snake Game application.
 * Dynamically imports the game module and starts the game on the canvas element.
 * @returns {void}
 */
function initApp() {
    import("./core/game.js").then(({ createGame }) => {
        const canvas = document.getElementById("canvas");
        createGame(canvas).initialize();
    });
}

window.onload = initApp;
