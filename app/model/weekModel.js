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
                    console.log("RESULT:", res);
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