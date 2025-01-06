const fs = require('fs');

const readStream = fs.createReadStream('./text.txt', { encoding: 'utf-8'});
const writeStream = fs.createWriteStream('./text-copy.txt', {encoding: 'utf-8'});

readStream.on('data', (chunk) => {
    writeStream.write(chunk);
});

readStream.on('end', () => {
    writeStream.end();
});

// same functionality
// readStream.pipe(writeStream);