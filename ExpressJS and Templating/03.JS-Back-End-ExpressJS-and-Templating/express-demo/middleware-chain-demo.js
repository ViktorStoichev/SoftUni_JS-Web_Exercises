const middlewareChain = require('./middleware-chain');

middlewareChain.use((req, res, next) => {
    console.log('First MIddleware');
    next();
});

middlewareChain.use((req, res, next) => {
    console.log('Second MIddleware');
    next();
})

middlewareChain.use((req, res, next) => {
    console.log('Third MIddleware');
    next();
});

middlewareChain.execute({}, {});
