/**
 * Creates and returns an Event Bus object.
 * Allows components to subscribe to and emit events.
 * @returns {object} The interface with 'on', 'off', and 'emit' methods.
 */
export function createEventBus() {
    const subscribers = new Map();

    /**
     * Registers a callback function for a given event type.
     * @param {string} eventName - The name of the event to subscribe to (e.g., 'PLAYER_MOVE').
     * @param {function} callback - The function that will be called when the event is emitted.
     */
    function on(eventName, callback) {
        if (!subscribers.has(eventName)) {
            subscribers.set(eventName, new Set());
        }
        subscribers.get(eventName).add(callback);
    }

    /**
     * Removes the subscription of a callback function for a given event type.
     * @param {string} eventName - The name of the event.
     * @param {function} callback - The function to be removed.
     */
    function off(eventName, callback) {
        if (!subscribers.get(eventName)) {
            return;
        }

        subscribers.get(eventName).delete(callback);
        if (subscribers.get(eventName).size === 0) {
            subscribers.delete(eventName);
        }
    }

    /**
     * Emits an event, calling all registered callback functions.
     * @param {string} eventName - The name of the emitted event.
     * @param {*} [payload] - Optional payload to pass to the subscribers.
     */
    function emit(eventName, payload) {
        if (!subscribers.get(eventName)) {
            return;
        }

        for (const handler of subscribers.get(eventName)) {
            handler(payload);
        }
    }

    return {
        on,
        off,
        emit,
    };
}
