import express from 'express';

const app = express();

app.get('/', (req, res) => {
    // Read cookie
    const cookie = req.header('Cookie');
    console.log(cookie);
    
    res.send('<h1>Home Page</h1>');
});

app.get('/login', (req, res) => {
    // Set cookie
    res.setHeader('Set-Cookie', 'isAuthenticated=true');

    res.setHeader('Location', '/');
    res.end();
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
