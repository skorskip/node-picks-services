'user strict';
var sql = require('./db.js');
var Game = require('../model/gameModel.js');
var Data = require('../model/dataModel.js');

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
            teams.push(game.awayTeam);
            teams.push(game.homeTeam);
        });
        result(null, Week.weekMapper(data, data[0].season, data[0].week, teams));
    });
}

Week.getCurrentWeek = function getCurrentWeek(req, result) {
    var currWeek;
    var currSeason;
    //var currDate = new Date();
    sql.query("SELECT * FROM games WHERE date in (SELECT MAX(date) FROM games)", req, function(err, res){
        if(err) result(err, null);
        
        currSeason = res[0].season;
        currWeek = res[0].week;
        // if(res[0].week < 17 && currDate > res[0].date) {
        //     currWeek++;
        // }
        Week.getWeek(currSeason, currWeek, function(err, games){
            if(err) result(err,null);
            else result(null,games);
        });
    
    });
}

Week.getWeekSQL = function getWeekSQL(season, week, result) {
    sql.query("SELECT * FROM games where season = ? AND week = ?", [season, week], function(err, data){
        if(err) result(err, null);

        if(data.length == 0){
            Week.populateWeekData(season, week, function(err, res) {
                if(err) result(err, null);
                
                Week.getWeekSQL(season, week, function(err, dataPopulated) {
                    if(err) result(err, null);
                    else result(null, dataPopulated);
                });
            });
        } else {
            result(null, data);
        }
    });
};

Week.updateWeek = function updateWeek(){

};

Week.populateWeekData = function populateWeekData(season, week, result){
    Data.getWeekData(season, week, function(err, data){
        if(err) result(err, null);
        else { 
            Game.insertAPIData(data, week, season, function(err, res){
                if(err) result(err, null);
                else {
                    result(null, res);
                }
            });
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