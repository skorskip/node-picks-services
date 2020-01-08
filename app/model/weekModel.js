'user strict';
var sql = require('./db.js');
var League = require('./leagueModel');

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
        if(data.length > 0) {
            data.forEach(game => {
                teams.push(game.away_team);
                teams.push(game.home_team);
            });
        }
        result(null, Week.weekMapper(data, season, week, teams));
    });
}

Week.getCurrentWeek = function getCurrentWeek(req, result) {
    League.leagueSettings(function(err,settings){
        if(err) result(err, null);

        var currDate = new Date();
        var seasonStart = new Date(settings.seasonStart);
        var deltaDate = Math.abs(currDate - seasonStart);    
        var currWeek = Math.floor(((deltaDate / (1000*60*60*24)) / 7)) + 1;


        if(currWeek > settings.seasonEndWeek) {
            currWeek = settings.seasonEndWeek;
        }
        
        var currWeekObj = {};
        currWeekObj.season = settings.currentSeason;
        currWeekObj.week = currWeek;
    
        result(null, currWeekObj);
    });
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

Week.weekMapper = function(games, season, week, teams) {
    var weekObject = {};
    weekObject.games = games;
    weekObject.number = week;
    weekObject.season = season;
    weekObject.teams = teams;
    return weekObject;
};

module.exports= Week;