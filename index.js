'use strict';

const http = require('http');
const utils = require('./utils');

const server = http.createServer();

// server.on('request', (request, response) => {
//     const { headers, method, url } = request;
//     let body = [];
//     request
//         .on('error', utils.handleError)
//         .on('data', (chunk) => body.push(chunk))
//         .on('end', () => utils.processRequest(Buffer.concat(body).toString(), response));
// });
server.on('request', utils.handleRequest);

server.listen(process.env.PORT || 1338);
