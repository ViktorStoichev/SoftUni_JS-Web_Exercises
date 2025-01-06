const fs = require('fs');

const writableStream = fs.createWriteStream('./output.txt', {
     encoding: 'utf-8',
     flags: 'a'
    })

writableStream.write('Hello\n');
writableStream.write('My name is hsjfsafsag\n');

writableStream.end();