import { Router } from 'express';

import { homeController } from './controllers/home-controller.js';
import { authController } from './controllers/auth-controller.js';
import { stoneController } from './controllers/stone-controller.js';

const routes = Router();

routes.use(homeController);
routes.use('/auth', authController);
routes.use('/stones', stoneController);

routes.all('*', (req, res) => {
    res.render('home/404', { title: '404 Page' });
});

export default routes;