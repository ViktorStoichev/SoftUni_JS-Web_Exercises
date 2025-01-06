const express = require('express');

const logger = require('./middlewares/loggerMiddleware');

const app = express();

app.use(express.static('public'))
app.use(logger);
app.use((req, res, next) => {
    console.log('Second middleware');
    next();
})

app.get('/', (req, res) => {
    console.log('get request on /');

    res.send('<h1>Hello from Express!</h1>');
});

app.get('/cats', (req, res) => {
    res.send('<h1>Cats Page</h1>')
});

app.get('/cats/:catId', (req, res) => {
    console.log(req.params);

    res.send(`<h1>Cat Profile of ${req.params.catId}</h1>`)
});

app.get('/old-cats', (req, res) => {
    res.redirect('/cats'); 
});

app.get('/download/pdf', (req, res) => {
    res.download('./downloads/manual.pdf');
});

app.get('/download/img', (req, res) => {
    res.download('./downloads/cat1.jpg');
});

app.all('*', (req, res) => {
    res.send('<h1>404 Page</h1>')
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
