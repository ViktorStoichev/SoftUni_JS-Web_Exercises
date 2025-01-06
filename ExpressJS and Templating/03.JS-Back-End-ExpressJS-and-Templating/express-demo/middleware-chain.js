const middlewares = [];

// Add middleware
function use(middleware) {
    middlewares.push(middleware);
}

function execute(req, res) {
    let index = 0;
    
    const next = () => {
        if (index >= middlewares.length) {
            return;
        }

        middlewares[index++](req, res, next);
    }

    next();
}


module.exports = {
    use,
    execute,
}
