function logger(req, res, next) {
    console.log(`HTTP Request - Method: ${req.method} | URL: ${req.url}`);

    next();
}

module.exports = logger;
