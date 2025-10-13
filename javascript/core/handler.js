/**
 * Creates the Keydown Handler module.
 * This module listens for key presses and maps them to game engine actions.
 *
 * @param {object} engine - The game engine interface (must expose togglePause and setDirection).
 * @returns {object} Public interface to start and stop the input listener.
 */
export function createKeydownHandler(engine) {
    /**
     * The core event handler function that processes key presses.
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    const handler = (event) => {
        if (
            [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                event.key
            )
        ) {
            event.preventDefault();
        }

        switch (event.key) {
            case " ":
                engine.togglePause();
                break;
            case "ArrowLeft":
            case "a":
                engine.setDirection(-1, 0);
                break;
            case "ArrowUp":
            case "w":
                engine.setDirection(0, -1);
                break;
            case "ArrowRight":
            case "d":
                engine.setDirection(1, 0);
                break;
            case "ArrowDown":
            case "s":
                engine.setDirection(0, 1);
                break;
        }
    };

    function start() {
        window.addEventListener("keydown", handler);
    }

    function stop() {
        window.removeEventListener("keydown", handler);
    }

    return { start, stop };
}
