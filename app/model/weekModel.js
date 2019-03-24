'user strict';
var sql = require('./db.js');
var Game = require('../model/gameModel.js');
var Data = require('../model/dataModel.js');

var Week = {};

Week.getWeek = function getWeek(season, week, result){
    Week.getWeekSQL(season, week, function(err, data){
        if(err) result(err, null);
        else {
            if(data.length == 0){
                Week.populateWeekData(season, week, function(err, res) {
                    if(err) result(err, null);
                    else {
                        Week.getWeekSQL(season, week, function(err, dataPopulated) {
                            if(err) result(err, null);
                            else result(null, dataPopulated);
                        });
                    }
                });
            } else {
                result(null, data);
            }
        }
    });
}

Week.getCurrentWeek = function getCurrentWeek(req, result) {
    var currWeek;
    var currSeason;
    var currDate = new Date();
    sql.query("SELECT * FROM games WHERE date in (SELECT MAX(date) FROM games)", req, function(err, res){
        if(err) result(err, null);
        else {
            currSeason = res[0].season;
            if(res[0].week < 17 && currDate > res[0].date) {
                currWeek = res[0].week + 1;
            } else {
                currWeek = res[0].week;
            }
            Week.getWeek(currSeason, currWeek, function(err, games){
                if(err) result(err,null);
                else result(null,games);
            });
        }
    });
}

Week.getWeekSQL = function getWeekSQL(season, week, result) {
    sql.query("SELECT * FROM games where season = ? AND week = ?", [season, week], function(err, res){
        if(err) result(err, null);
        else result(null,res);
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


function checkWeek(weekInfo, result) {
    console.log("CHECK WEEK:", weekInfo);
    result(null, weekInfo);
}

module.exports= Week;