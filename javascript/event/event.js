
/**
 * Creates and returns a strongly-typed Event Bus object.
 * Only allows subscribing and emitting events defined in GameEvents.
 *
 * @returns {import('../types/event').EventBusPublicAPI}
 */
export function createEventBus() {
    const subscribers = new Map();

    function on(eventName, callback) {
        if (!subscribers.has(eventName)) {
            subscribers.set(eventName, new Set());
        }
        subscribers.get(eventName).add(callback);
    }

    function off(eventName, callback) {
        if (!subscribers.get(eventName)) return;
        subscribers.get(eventName).delete(callback);
        if (subscribers.get(eventName).size === 0) {
            subscribers.delete(eventName);
        }
    }

    function emit(eventName, payload) {
        if (!subscribers.get(eventName)) return;
        for (const handler of subscribers.get(eventName)) {
            handler(payload);
        }
    }

    return { on, off, emit };
}
