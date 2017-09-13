var http = require('http');

// var server = http.createServer((request, response) => {

//     response.writeHead(200, { "Content-Type": "text/plain" });
//     response.end("Hello World!");

// });

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
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(`${headers} ${method} ${url} ${body}`);
    });
});

var port = process.env.PORT || 1338;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
