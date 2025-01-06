import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
    secret: 'askdjhkasjhdkajshd',
    resave: false,
    saveUnitialized: true,
    cookie: { secure: false },
}));

app.get('/', (req, res) => {
    console.log(req.session);

    res.send('<h1>Home Page</h1>');
});

app.get('/login', (req, res) => {
    req.session.value = Date.now();
    res.redirect('/');
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
