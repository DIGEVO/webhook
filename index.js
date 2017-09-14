'use strict';

const http = require('http');
const server = http.createServer();

function processMessage(strBody, response) {
    const body = JSON.parse(strBody === '' ? '{}' : strBody);

    response.on('error', handleError);
    response.writeHead(200, { 'Content-Type': 'application/json' });

    body.paused = body.paused || false;
    body.userId = body.userId || null;
    body.conversationId = body.conversationId || null;
    body.text = body.text || null;
    body.apiKey = body.apiKey || null;
    const responseBody = { body: JSON.stringify(body) };

    console.log(JSON.stringify(responseBody));

    response.end(JSON.stringify(responseBody));
}

function handleError(err) {
    console.error(err);
}

server.on('request', (request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', handleError)
        .on('data', (chunk) => body.push(chunk))
        .on('end', () => {
            const strBody = Buffer.concat(body).toString();
            processMessage(strBody, response);
            //body = JSON.parse(strBody === '' ? '{}' : strBody);

           // response.on('error', handleError);
           // response.writeHead(200, { 'Content-Type': 'application/json' });

            // body.paused = body.paused || false;
            // body.userId = body.userId || null;
            // body.conversationId = body.conversationId || null;
            // body.text = body.text || null;
            // body.apiKey = body.apiKey || null;
            // const responseBody = { body: JSON.stringify(body) };

            // console.log(JSON.stringify(responseBody));

            // response.end(JSON.stringify(responseBody));
        });
});



var port = process.env.PORT || 1338;
server.listen(port);

//console.log("Server running at http://localhost:%d", port);
