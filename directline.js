'use strict';

const Swagger = require('swagger-client');
const rp = require('request-promise');
const Promise = require('promise');
require('dotenv').config();

const dashbotApiMap = {
    'facebook': process.env.DASHBOT_API_KEY_GENERIC,
    'webchat': process.env.DASHBOT_API_KEY_GENERIC,
    'skype': process.env.DASHBOT_API_KEY_GENERIC,
    'emulator': process.env.DASHBOT_API_KEY_GENERIC,
};

const dashbot = require('dashbot')(dashbotApiMap).microsoft;
dashbot.setFacebookToken(process.env.FACEBOOK_PAGE_TOKEN);

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

    logIncommingMessages(activities) {
        if (activities && activities.length) {
            activities = activities.filter((m) => m.from.id !== process.env.CLIENT);

            if (activities.length) {
                activities.forEach(module.exports.logIncommingMessage);
            }
        }
    },

    logIncommingMessage(activity) {
        dashbot.logIncomingInternal({
            text: JSON.stringify(activity ? activity : {}),
            timestamp: Date.now()
        }, 'webhook', 'incoming');
    },
    
    sendMessagesFromDashbot(client, conversationId, message) {
        dashbot.logOutgoingInternal({
            text: message,
            timestamp: Date.now()
        }, 'webhook');

        client.Conversations
            .Conversations_PostActivity({
                conversationId: conversationId,
                activity: {
                    textFormat: 'plain',
                    text: message,
                    type: 'message',
                    from: {
                        id: process.env.CLIENT,
                        name: process.env.CLIENT
                    }
                }
            })
            .catch((err) => console.error('Error sending message: ', err));
    },

    pollMessages(client, conversationId) {
        var watermark = null;
        setInterval(() => {
            client.Conversations
                .Conversations_GetActivities({ conversationId: conversationId, watermark: watermark })
                .then((response) => {
                    watermark = response.obj.watermark;
                    return response.obj.activities;
                })
                .then(module.exports.printMessages)
                .catch((error) => console.error(error));
        }, process.env.INTERVAL);
    }
}