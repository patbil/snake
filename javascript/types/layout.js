/** @typedef {import('./engine').TickSnapshot} TickSnapshot */
/** @typedef {import('./config').GameConfig} GameConfig */
/** @typedef {import('./event').EventBusPublicAPI} EventBusPublicAPI */


/**
 * @typedef {Object} LayoutManagerPublicAPI
 * @property {(score: number) => void} setScore - Updates the score display in the UI.
 * @property {(level: number) => void} setLevel - Updates the level display in the UI.
 * @property {(username: string) => void} setUsername - Sets and displays the username, and stores it in localStorage.
 * @property {() => void} resetAll - Resets UI elements to initial state.
 * @property {(isPaused: boolean) => void} togglePauseModal - Shows/hides the pause modal.
 * @property {(snapshot: TickSnapshot) => void} showGameOverModal - Displays the game over modal with final stats.
 * @property {() => Promise<string>} showUsernameModal - Shows the username input modal.
 * @property {() => void} showSettingsModal - Shows the settings modal and syncs inputs with current settings.
 */

export {};
