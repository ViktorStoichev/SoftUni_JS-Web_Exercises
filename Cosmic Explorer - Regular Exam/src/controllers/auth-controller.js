import { Router } from "express";
import authService from "../services/auth-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth, isGuest } from "../middlewares/auth-middleware.js";

const router = Router();

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

router.post('/register', isGuest, async (req, res) => {
    // Get input
    const { username, email, password, rePassword } = req.body;

    // Check repassword

    try {
        // Call auth service register
        const token = await authService.register(username, email, password, rePassword);
        res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });
        // Redirect to home
        res.redirect('/');
    } catch (err) {
        // Add error
        const error = getErrorMessage(err);
        res.render('auth/register', { title: 'Register', username, email, error });
    }

});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

router.post('/login', isGuest, async (req, res) => {
    // Get login data
    const { username, password } = req.body;

    try {
        // Use auth service login
        const token = await authService.login(username, password);

        // Add token to cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });

        // Redirect to home
        res.redirect('/');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('auth/login', { title: 'Login', username, error });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(process.env.AUTH_COOKIE_NAME);

    res.redirect('/');
});

export const authController = router;