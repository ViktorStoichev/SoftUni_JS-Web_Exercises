const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`Incomming http req -> ${req.url}`);

    
    res.writeHead(200, {
        'Content-Type': 'text/html',
    })
    
    if (req.url === '/cats') {
        res.write('<h1>cats</h1>');
    } else {
        res.write('<h1>haist</h1>');
    }
    
    res.end();
});

server.listen(5000);

console.log('Server is running on http://localhost:5000...');
