const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, '..','static/index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        console.log(path.join(__dirname, '..', 'static/index.html'));
        res.end('Not Found');
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});