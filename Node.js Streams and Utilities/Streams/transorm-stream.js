const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('./text.txt', { encoding: 'utf-8'});
const writeStream = fs.createWriteStream('./text-copy.txt', {encoding: 'utf-8'});
const gzipStream = zlib.createGzip();

readStream.pipe(gzipStream).pipe(writeStream);

