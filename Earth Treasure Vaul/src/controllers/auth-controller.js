import { Router } from "express";
import authService from "../services/auth-service.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth, isGuest } from "../middlewares/auth-middleware.js";

const router = Router();

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { title: 'Register Page' });
});

router.post('/register', isGuest, async (req, res) => {
    // Get input
    const { email, password, rePassword } = req.body;

    // Check repassword

    try {
        // Call auth service register
        const token = await authService.register( email, password, rePassword );
        res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });
        // Redirect to home
        res.redirect('/');
    } catch (err) {
        // Add error
        const error = getErrorMessage(err);
        res.render('auth/register', { title: 'Register Page', email, error });
    }

});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { title: 'Login Page' });
});

router.post('/login', isGuest, async (req, res) => {
    // Get login data
    const { email, password } = req.body;

    try {
        // Use auth service login
        const token = await authService.login(email, password);

        // Add token to cookie
        res.cookie(process.env.AUTH_COOKIE_NAME, token, { httpOnly: true });

        // Redirect to home
        res.redirect('/');
    } catch (err) {
        const error = getErrorMessage(err);
        res.render('auth/login', { title: 'Login Page', email, error });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(process.env.AUTH_COOKIE_NAME);

    res.redirect('/');
});

export const authController = router;