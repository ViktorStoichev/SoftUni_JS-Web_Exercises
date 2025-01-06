
const querystring = require('querystring');

// URL
const address = 'https://en.wikipedia.org/wiki/Node.js?name=Pesho&age=20#Internals';
const url = new URL(address);

console.log(address);
console.log(url);
console.log(url.searchParams.get('name'));

// querystring
const searchQuery = 'name=Pesho&age=20';
const qs = querystring.parse(searchQuery);
console.log(qs);

