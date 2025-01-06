import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

const SECRET = '872c67123bc704fa12bf557c93e30cac';

const registeredUsers = {
    'Ivo': '$2b$10$ZAho9E0hR0mmYYT26xhiQObcJy1E1JCWTgEVl25DqtyTcJiyTmJN2',
};

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

app.get('/register', (req, res) => {
    res.send(`
    <form action="/register" method="POST">
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
        </div>
        <div>
            <input type="submit" value="Register">
        </div>
    </form>
    `);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    console.log(salt);

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    registeredUsers[username] = hashedPassword;

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
    <form action="/login" method="POST">
        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" name="password" id="password" />
        </div>
        <div>
            <input type="submit" value="Login">
        </div>
    </form>
    `);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!registeredUsers[username]) {
        return res.status(400).end();
    }

    const plainPassword = password;
    const hashedPassword = registeredUsers[username];

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);

    // Return jwt token on sucessful authentication
    const payload = {
        username,
        admin: true,
    };

    const jwtToken = jwt.sign(payload, SECRET, { expiresIn: '2h' });

    res.cookie('auth', jwtToken, { httpOnly: true });

    if (isValid) {
        return res.redirect('/profile')
    }

    res.send('Invalid password');
});

app.get('/profile', (req, res) => {
    const jwtToken = req.cookies['auth'];

    if (!jwtToken) {
        return res.status(401).send('<h1>Unauthorized!</h1>')
    }

    try {
        const decodedToken = jwt.verify(jwtToken, SECRET);

        return res.send(`Welcome ${decodedToken.username}`);
    } catch (err) {
        res.clearCookie('auth');
        console.log(err.message);
        return res.status(401).send('<h1>Unauthorized!</h1>')
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});


app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
