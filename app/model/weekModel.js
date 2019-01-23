'user strict';
var sql = require('./db.js');
var Game = require('../model/gameModel.js');
var Data = require('../model/dataModel.js');

var Week = {};

Week.getWeek = function getTeamById(season, week, result) {
    this.populateWeekData(season, week);
    sql.query("SELECT * FROM games where season = ? AND week = ?", [season, week], function(err, res){
        if(err) result(err, null);
        else result(null,res);
    });
};

Week.updateWeek = function updateWeek(){

};

Week.populateWeekData = function populateWeekData(season, week){
    Data.getWeekData(season, week, function(err, data){
        if(err) console.log(err);
        else Game.insertAPIData(data, function(err, result){
            if(err) console.log("ERROR:", err);
            else console.log(result);
        })
    })
};


function checkWeek(weekInfo, result) {
    console.log("CHECK WEEK:", weekInfo);
    result(null, weekInfo);
}

module.exports= Week;