'use strict';

const http = require('http');
const utils = require('./utils');

const server = http.createServer();
server.on('request', utils.handleRequest);
server.listen(process.env.PORT || 1338);
