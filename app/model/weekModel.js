'user strict';
var sql = require('./db.js');
var config = require('../../config.json');
var Team = require('./teamModel.js');

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
        Week.weekMapper(data, season, week, function(errMapping, weekObject){
            if(errMapping) result(errMapping, null);
            result(null, weekObject);
        });
    });
}

Week.getCurrentWeek = function getCurrentWeek(req, result) {
    var currDate = new Date();
    var seasonStart = new Date(config.data.nflSeason, config.data.nflStartMonth, config.data.nflStartDay, config.data.nflStartTime, 0, 0);
    var deltaDate = Math.abs(currDate - seasonStart);    
    var currWeek = Math.floor(((deltaDate / (1000*60*60*24)) / 7)) + 1;

    var currWeekObj = {};
    currWeekObj.season = config.data.nflSeason;
    currWeekObj.week = currWeek;

    result(null, currWeekObj);
}

Week.getWeekSQL = function getWeekSQL(season, week, result) {
    sql.query("SELECT * FROM games where season = ? AND week = ? AND home_spread is not NULL ORDER BY start_time", [season, week], function(err, data){
        if(err) { 
            result(err, null);
        } else {
            result(null, data);
        }
    });
};

Week.weekMapper = function(games, season, week, result) {
    var weekObject = {};
    weekObject.games = games;
    weekObject.number = week;
    weekObject.season = season;
    
    var teams = [];
    if(games.length > 0) {
        games.forEach(game => {
            teams.push(game.away_team);
            teams.push(game.home_team);
        });
    }

    Team.getTeamsById(teams, function(err, teams){
        if(err) result(err, null);
        weekObject.teams = teams;
        result(null, weekObject);
    });
};

module.exports= Week;