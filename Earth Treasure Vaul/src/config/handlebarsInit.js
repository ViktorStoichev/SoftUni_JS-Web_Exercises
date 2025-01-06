import handlebars from 'express-handlebars';

export default function handlebarsInit(app) {
    app.engine('hbs', handlebars.engine({
        extname: 'hbs',
    }));
    app.set('views', 'src/views');
    app.set('view engine', 'hbs');
}