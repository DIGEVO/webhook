'use strict';

var Swagger = require('swagger-client');
var rp = require('request-promise');
const Promise = require('promise');

require('dotenv').config();

module.exports = {
    createClient: () => {
        return rp(process.env.SPEC)
            .then(function (spec) {
                return new Swagger({
                    spec: JSON.parse(spec.trim()),
                    usePromise: true
                });
            })
            .then(function (client) {
                client.clientAuthorizations.add('AuthorizationBotConnector',
                    new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + process.env.SECRET, 'header'));
                return client;
            })
            .catch(function (err) {
                console.error('Error initializing DirectLine client', err);
            });
    },
    /*
    */
    printMessages(activities) {
        if (activities && activities.length) {
            // ignore own messages
            activities = activities.filter(function (m) { return m.from.id !== process.env.CLIENT });

            if (activities.length) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);

                activities.forEach(module.exports.printMessage);
            }
        }
    },
    /*
    */
    printMessage(activity) {
        if (activity.text) {
            console.log(activity.text);
        }

        if (activity.attachments) {
            activity.attachments.forEach((attachment) => {
                if (attachment.contentType == 'application/vnd.microsoft.card.hero') {
                    module.exports.renderHeroCard(attachment);
                }
            });
        }
    },
    /*
    */
    renderHeroCard(attachment) {
        if (attachment.content.buttons && attachment.content.buttons.length) {
            attachment.content.buttons.forEach(b => console.log(`${b.title}`));
        }
    },
    /**
     * 
     */
    processRequest(strBody, response) {
        const body = JSON.parse(strBody === '' ? '{}' : strBody);

        response.on('error', module.exports.handleError);
        response.writeHead(200, { 'Content-Type': 'application/json' });

        body.paused = body.paused || false;
        body.userId = body.userId || null;
        body.conversationId = body.conversationId || null;
        body.text = body.text || null;
        body.apiKey = body.apiKey || null;
        const responseBody = { body: JSON.stringify(body) };

        console.log(JSON.stringify(responseBody));

        response.end(JSON.stringify(responseBody));
    },

    handleError(err) {
        console.error(err);
    },

    handleRequest(request, response) {
        const { headers, method, url } = request;
        let body = [];
        request
            .on('error', module.exports.handleError)
            .on('data', (chunk) => body.push(chunk))
            .on('end', () => module.exports.processRequest(Buffer.concat(body).toString(), response));
    }
};