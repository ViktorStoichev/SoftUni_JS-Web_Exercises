const calculator = require('calculator')

function execute() {
    var f = calculator.func('f(x) = x*10 - 20');
    console.log(f(3));
    // returns 10
}

module.exports = execute;