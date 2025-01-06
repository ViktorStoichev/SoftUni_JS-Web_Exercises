import express from 'express';
import 'dotenv/config';
import routes from './routes.js';
import expressInit from './config/expressInit.js';
import handlebarsInit from './config/handlebarsInit.js';
import mongooseInit from './config/mongooseInit.js';

const app = express();
const port = 3000;

mongooseInit();
handlebarsInit(app);
expressInit(app);

app.use(routes);

app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));