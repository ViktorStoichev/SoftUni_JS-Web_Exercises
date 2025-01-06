const fs = require('fs');

const readableStream = fs.createReadStream('./text.txt', { 
    encoding: 'utf-8',
    highWaterMark: 1000
 });

readableStream.on('data', (chunk) => {
    console.log('----- NEW CHUNK -----');
    
    console.log(chunk);
});

readableStream.on('end', () => {
    console.log('Readable stream ended');
})