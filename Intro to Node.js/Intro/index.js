const sum = require('./calculator');
const executeCalculation = require('./third-party-modules');
require('./core-modules');

console.log(sum(1, 5));
executeCalculation();
