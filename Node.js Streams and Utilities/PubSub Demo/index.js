const messageBroker = require('./messageBroker');

function messageReceivedHandler(message, sender) {
    console.log(`${sender}: ${message}`);
    
}

function logMessage(message) {
    console.log(`Message: ${message} - neshto si`);
    
}

messageBroker.subscribe('message_received', messageReceivedHandler);
messageBroker.subscribe('message_received', logMessage);
messageBroker.subscribe('message_deleted', logMessage);

messageBroker.publish('message_received', 'Hi Pesho', 'Gosho');
messageBroker.publish('message_received', 'Bye Gosho', 'Pesho');
messageBroker.publish('message_deleted', 'invalid msg');

messageBroker.unsubscribe('message_received', logMessage);