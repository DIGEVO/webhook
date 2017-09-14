var http = require('http');

const server = http.createServer();
server.on('request', (request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        response.on('error', (err) => console.error(err));

        response.writeHead(200, { 'Content-Type': 'application/json' });

        const responseBody = { headers, method, url, body };
        response.end(JSON.stringify(responseBody));
    });
});

var port = process.env.PORT || 1338;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
