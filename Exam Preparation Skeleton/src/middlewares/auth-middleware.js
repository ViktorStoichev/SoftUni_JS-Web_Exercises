import { jwt } from "../lib/jwt.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME];

    if (!token) {
        return next();
    };

    // Validate token
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        req.isAuthenticated = true;

        res.locals.user = decodedToken;
        res.locals.isAuthenticated = true;

        next();
    } catch (err) {
        res.clearCookie(process.env.AUTH_COOKIE_NAME);

        res.redirect('/auth/login');
    }
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        res.redirect('/404');
    };

    next();
};

export const isGuest = (req, res, next) => {
    if (req.user) {
        res.redirect('/404');
    };

    next();
};