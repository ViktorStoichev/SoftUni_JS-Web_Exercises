const events = require('events');

const messageBroker = new events.EventEmitter();

const messageReceivedHandler = (message) => {
    console.log(`Message received: ${message}`);
    
};


// Subscribe
messageBroker.on('message-received', messageReceivedHandler);

messageBroker.emit('message-received', 'Hello world!');

// Unsubscribe
messageBroker.off('message-received', messageReceivedHandler);

messageBroker.emit('message-received', 'Hello Pesho!');