/** @typedef {import('../types/events').GameEvents} GameEvents */

/**
 * @typedef {Object} EventBusPublicAPI
 * @property {<K extends keyof GameEvents>(type: K, listener: (payload: GameEvents[K]) => void) => void} on
 * @property {<K extends keyof GameEvents>(type: K, listener: (payload: GameEvents[K]) => void) => void} off
 * @property {<K extends keyof GameEvents>(type: K, payload: GameEvents[K]) => void} emit
 */

export {};