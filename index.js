'use strict';

const http = require('http');
// const concat = require('concat-stream');

const server = http.createServer();

// const concatOnMessage = concat(gotMessage);
// const concatOnPause = concat(gotPause);

// function gotMessage(body) {
//     const responseBody = { body };
//     console.log(JSON.stringify(responseBody));
// }

// function gotPause(body) {
//     const responseBody = { body };
//     console.log(JSON.stringify(responseBody));
// }

function handleError(err) {
    console.error(err);
}

server.on('request', (request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', handleError)
        .on('data', (chunk) => body.push(chunk))
        .on('end', () => {
            body = JSON.parse(Buffer.concat(body).toString());

            response.on('error', handleError);
            response.writeHead(200, { 'Content-Type': 'application/json' });

            body.paused = body.paused || false;
            const responseBody = { url, body: JSON.stringify(body) };

            console.log(JSON.stringify(responseBody));

            response.end(JSON.stringify(responseBody));
        });
});



var port = process.env.PORT || 1338;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
