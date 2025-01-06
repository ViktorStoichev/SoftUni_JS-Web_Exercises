import express from 'express';
import handlebars from 'express-handlebars';
import formidable from 'formidable';
import fs from 'fs/promises';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

const cats = [
    { name: 'Navcho', age: 9, breed: 'Persian' },
    { name: 'Sisa', age: 14, breed: 'Angora' },
    { name: 'Garry', age: 7, breed: 'Angora' },
    { name: 'Kitty', age: 2, breed: 'Persian', forSale: true }
];

// 1. Register/Add view engine
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

// 2. Set default view engine
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    // 3. Return template as response
    res.render('home');
});

app.get('/cats', (req, res) => {
    res.render('cats', { cats });
});

app.get('/cats/:catName', (req, res) => {
    const currentCat = cats.find(cat => cat.name === req.params.catName);

    res.render('catDetails', { cat: currentCat })
});

app.post('/cats/:catName/upload', async (req, res) => {
    const form = formidable({});
    const [fileds, files] = await form.parse(req);
    const [persistentFile] = files.photo;

    const newPath = `./uploads/${persistentFile.originalFilename}`;
    await fs.copyFile(persistentFile.filepath.toString(), newPath);

    const currentCat = cats.find(cat => cat.name === req.params.catName);
    currentCat.imageUrl = newPath;

    res.redirect(`/cats/${req.params.catName}`);
});

app.get('/cats/add', (req, res) => {
    res.render('addCat');
});

app.post('/cats/add', (req, res) => {
    const newCat = req.body;

    cats.push(newCat);

    res.redirect('/cats');
});

app.listen(5000, () => console.log('Server is listening on http://localhost:5000'));
