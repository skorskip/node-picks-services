'use strict';
var request = require('request');

var Data = {};

Data.getWeekData = function(season, week, result) {
    var username = "********";
    var password = "MYSPORTSFEEDS";
    var url = "https://" +
            username + ":" + password +
            "@api.mysportsfeeds.com/v2.0/pull/nfl/" +
            season + "-regular/" +
            "week/" + week + "/games.json";
    
    request({url}, function(error, response, body){
        if(error)result(error, null);
        else result(null, body);
    });
}

module.exports = Data;