import express from 'express';
import cookieParser from 'cookie-parser';
import { authMiddleware } from '../middlewares/auth-middleware.js';

export default function expressInit(app) {
    app.use('/styles', express.static('src/public'));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(authMiddleware);
};