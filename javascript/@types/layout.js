/** @typedef {import('./engine').TickSnapshot} TickSnapshot */
/** @typedef {import('./config').GameConfig} GameConfig */
/** @typedef {import('./event').EventBus} EventBus */

/**
 * Public API of the Layout Manager.
 * The Layout Manager is responsible for all DOM manipulations and UI updates.
 * 
 * @typedef {Object} LayoutManager
 * @property {(score: number) => void} setScore - Updates the score display in the UI.
 * @property {(level: number) => void} setLevel - Updates the level display in the UI.
 * @property {(username: string) => void} setUsername - Sets and displays the username in the UI.
 * @property {() => void} resetAll - Resets all UI elements to their initial state.
 * @property {(isPaused: boolean) => void} togglePauseModal - Shows or hides the pause modal overlay.
 * @property {(snapshot: TickSnapshot) => void} showGameOverModal - Displays the game over modal with final statistics.
 * @property {() => Promise<string>} showUsernameModal - Shows the username input modal and waits for user input.
 * @property {() => void} showSettingsModal - Shows the settings modal and synchronizes all input fields
 */

export {};
