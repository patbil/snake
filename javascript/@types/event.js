/** @typedef {import('./events.js').GameEvents} GameEvents */

/**
 * Public API of the Event Bus.
 * The Event Bus implements the publish-subscribe pattern, allowing modules to communicate without direct dependencies. 
 * 
 * @typedef {Object} EventBus
 * @property {<K extends keyof GameEvents>(type: K, listener: (payload: GameEvents[K]) => void) => void} on
 *           Subscribes a listener to a specific event type.
 *           The listener will be called whenever the event is emitted.
 *           @template K - Event type key from GameEvents
 *           @param {K} type - The event type to listen for (e.g., 'STATE.SCORE')
 *           @param {(payload: GameEvents[K]) => void} listener - Callback function to handle the event
 * 
 * @property {<K extends keyof GameEvents>(type: K, listener: (payload: GameEvents[K]) => void) => void} off
 *           Unsubscribes a listener from a specific event type.
 *           The listener must be the same function reference that was passed to `on`.
 *           @template K - Event type key from GameEvents
 *           @param {K} type - The event type to stop listening to
 *           @param {(payload: GameEvents[K]) => void} listener - The callback function to remove
 * 
 * @property {<K extends keyof GameEvents>(type: K, payload: GameEvents[K]) => void} emit
 *           Emits an event to all subscribed listeners.
 *           All listeners registered for this event type will be called synchronously.
 *           @template K - Event type key from GameEvents
 *           @param {K} type - The event type to emit
 *           @param {GameEvents[K]} payload - The event payload data
 */

export {};