const http = require('http');
const fs = require('fs/promises');
const querystring = require('querystring');
const { EOL } = require('os');
const path = require('path');

const siteCss = require('./resources/content/styles/site.css');
const { error } = require('console');

const port = 5000;

const cats = [
    {
        id: 1,
        name: 'Pretty Kitty',
        breed: 'Bombay cat',
        description: 'Orange',
        imageUrl: 'https://media.istockphoto.com/id/1443562748/photo/cute-ginger-cat.jpg?s=612x612&w=0&k=20&c=vvM97wWz-hMj7DLzfpYRmY2VswTqcFEKkC437hxm3Cg='
    },
    {
        id: 2,
        name: 'Navcho',
        breed: 'Bombay cat',
        description: 'Spi mu se',
        imageUrl: 'https://cdn.mos.cms.futurecdn.net/KHQb3Ny62YxXnCEon4mm43.jpg'
    },
    {
        id: 3,
        name: 'Sisa',
        breed: 'Bombay cat',
        description: 'Losho',
        imageUrl: 'https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg'
    },
    {
        id: 4,
        name: 'Mishi',
        breed: 'Bombay cat',
        description: 'Nishto mu nqma',
        imageUrl: 'https://media.istockphoto.com/id/1361394182/photo/funny-british-shorthair-cat-portrait-looking-shocked-or-surprised.jpg?s=612x612&w=0&k=20&c=6yvVxdufrNvkmc50nCLCd8OFGhoJd6vPTNotl90L-vo='
    },
    {
        id: 5,
        name: 'Garry',
        breed: 'Bombay cat',
        description: 'Shefo',
        imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/022/963/918/small_2x/ai-generative-cute-cat-isolated-on-solid-background-photo.jpg'
    }
];

function readFile(path) {
    return fs.readFile(path, {encoding: 'utf-8'});
}

async function renderCats(catData) {
    let catTemplate = await readFile('./resources/views/cat.html');
    Object.keys(catData).forEach(key => {
        catTemplate = catTemplate.replaceAll(`{{${key}}}`, catData[key]);
    });
    
    return catTemplate;
}

const server = http.createServer( async (req, res) => {

    if (req.url === '/styles/site.css') {
        res.writeHead(200, {
            'content-type': 'text/css'
        })
        res.write(siteCss);
        return res.end();
    }

    res.writeHead(200, {
        'content-type': 'text/html'
    })

    if (req.url === '/') {
        let indexHtml = await readFile('./resources/views/home/index.html');
        let catTemplateResult = await Promise.all(cats.map(renderCats));
        
        indexHtml = indexHtml.replaceAll('{{cats}}', catTemplateResult);
        
               
        res.write(indexHtml);
    } else if (req.url === '/cats/add-breed') {
        const addBreedHtml = await readFile('./resources/views/addBreed.html');
        res.write(addBreedHtml);
    } else if (req.url === '/cats/add-cat') {
        let body = [];

        if (req.method === 'POST') {
            req.on('data', chunk => {
                body.push(chunk);
                
            })

            req.on('close', () => {
                const dataBuffer = Buffer.concat(body);

                const data = dataBuffer.toString('binary');
                const boundary = req.headers['content-type'].split('boundary=').at(1);

                const tokens = data.split('--' + boundary);
                let separated = [];
                let obj = {};
                tokens.forEach(token => {
                    let [tMeta, tValue] = token.split(EOL + EOL);
                    if (tMeta && tValue) {
                        tValue = tValue.trim();
                        let tName = tMeta.match(/name="([^"]*)"/).at(1);                        
                        obj[tName] = tValue;
                    }
                    obj['id'] = Math.random();
                    
                })
                separated.push(obj);

                console.log(separated);
                

                const [name, value] = tokens[3].split(EOL + EOL);
                const fileName = name.match(/filename="(.+)"/).at(1);                

                const savePath = path.join(__dirname, 'uploads', fileName);
                fs.writeFile(savePath, value, 'binary')
                    .then( () => {
                        console.log('Image uploaded!');

                        // res.writeHead(302, {
                        //     'location': '/'
                        // });
                        res.end();
                    }), ( (error) => {
                        console.log(error);
                        return res.end();
                    })
            });
        }

        const addCatHtml = await readFile('./resources/views/addCat.html');
        res.write(addCatHtml);
    } else if (req.url === '/cats/edit-cat') {
        const editCatHtml = await readFile('./resources/views/editCat.html');
        res.write(editCatHtml);
    } else if (req.url === '/cats/cat-shelter') {
        const catShelterHtml = await readFile('./resources/views/catShelter.html');
        res.write(catShelterHtml);
    }

    res.end();
});

server.listen(port);
console.log(`Server is listening on http://localhost:${port}...`);
