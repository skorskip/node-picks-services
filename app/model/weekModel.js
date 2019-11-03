'user strict';
var sql = require('./db.js');
var Game = require('../model/gameModel.js');
var config = require('../../config.json')

var Week = function(week){
    this.number = week.number;
    this.games = week.games;
    this.season = week.season;
    this.teams = week.teams;
};

Week.getWeek = function getWeek(season, week, result){
    var getWeekSQL = new Promise((resolve, reject) => {
        Week.getWeekSQL(season, week, function(err, data){
            if(err) reject(result(err, null));  
            resolve(data);
        });
    });

    getWeekSQL.then(function(data, err) {
        if(err) result(err, null);
        
        var teams = [];
        data.forEach(game => {
            teams.push(game.away_team);
            teams.push(game.home_team);
        });
        result(null, Week.weekMapper(data, data[0].season, data[0].week, teams));
    });
}

Week.getCurrentWeek = function getCurrentWeek(req, result) {
    var currDate = new Date();
    var seasonStart = new Date(config.data.nflSeason, config.data.nflStartMonth, config.data.nflStartDay);

    var deltaDate = Math.abs(currDate - seasonStart);
    var currWeek = Math.ceil(((deltaDate / (1000*60*60*24)) / 7));

    Week.getWeek(config.data.nflSeason, currWeek, function(err, games){
        if(err) result(err,null);
        else result(null,games);
    });
}

Week.getWeekSQL = function getWeekSQL(season, week, result) {
    sql.query("SELECT * FROM games where season = ? AND week = ? AND home_spread is not NULL", [season, week], function(err, data){
        if(err) { 
            result(err, null);
        } else {
            result(null, data);
        }
    });
};

Week.weekMapper = function(games, season, week, teams) {
    var weekObject = {};
    weekObject.games = games;
    weekObject.number = week;
    weekObject.season = season;
    weekObject.teams = teams;
    return weekObject;
};

module.exports= Week;