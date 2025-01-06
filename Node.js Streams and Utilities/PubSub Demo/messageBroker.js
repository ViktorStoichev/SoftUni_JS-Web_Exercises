const events = {};

function publish (eventType, ...params) {
    if (!events[eventType]) {
        return;
    }

    events[eventType].forEach(listener => listener.apply(null, params));
    // events[eventType].forEach(listener => listener(...params));
}

function subscribe (eventType, listener) {
    if (!events[eventType]) {
        events[eventType] = [];
    }

    events[eventType].push(listener);
}

function unsubscribe(eventType, eventListener) {
    if (!events[eventType]) {
        return;
    }

    events[eventType] = events[eventType].filter(listener => listener !== eventListener);
}

module.exports = {
    publish,
    subscribe,
    unsubscribe
}