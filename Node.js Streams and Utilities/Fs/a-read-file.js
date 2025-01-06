const fs = require('fs');
const fsPromises = require('fs/promises');

// Synchronous reading / block other users until finish
const inputText = fs.readFileSync('./input.txt', { encoding: 'utf-8' });
console.log(inputText);

// Asynchronous reading
fs.readFile('./input.txt', { encoding: 'utf-8' }, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
    
});

// Async with promises
fsPromises.readFile('./input.txt', { encoding: 'utf-8' })
.then(result => console.log(result))
.catch(err => console.log(err))

console.log('after async');
