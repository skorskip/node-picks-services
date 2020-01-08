'use strict'
var League = require('./leagueModel');
const { WebClient } = require('@slack/web-api');

var Message = function(){}

Message.announcements = function announcements(body, result){
    League.leagueSettings(function(err, settings){
        if(err) result(err, null)

        const token = settings.messageSource.token;
        const web = new WebClient(token);

        (async () => {

            var startOfWeek = new Date(body.lastCheckDate);

            if(startOfWeek == null){
                startOfWeek = 0;
            } else {
                startOfWeek = startOfWeek.getTime() / 1000;
            }
    
            var responseObject = {};
            responseObject.announcements = 0;
            responseObject.announcement_date = new Date();
    
            const response = await web.channels.history({
                channel: settings.messageSource.channel,
                oldest: startOfWeek
            });
            
            var lastestTs = 0;
            for(let i = 0; i < response.messages.length; i++) {
                let message = response.messages[i];
                if(message.user == settings.messageSource.admin) {
                    responseObject.announcements += 1;
                    if(message.ts > lastestTs) {
                        lastestTs = message.ts;
                    }
                }
            }
    
            responseObject.announcement_date = new Date(lastestTs * 1000);
            result(null, responseObject);
        })();

    });
}

module.exports = Message;
