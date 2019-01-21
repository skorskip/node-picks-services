'use strict';
var request = require('request');
var config = require('../../config.json');

var Data = {};

Data.getWeekData = function(season, week, result) {
    var username = config.api.username;
    var password = config.api.password;
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