'user strict';
var sql = require('./db.js');
var Game = require('../model/gameModel.js');
var Data = require('../model/dataModel.js');

var Week = {};

Week.getWeek = function getTeamById(season, week, result) {
    this.populateWeekData();
    sql.query("SELECT * FROM games where season = ? AND week = ?", [season, week], function(err, res){
        if(err) result(err, null);
        else result(null,res);
    });
};

Week.updateWeek = function updateWeek(){

};

Week.populateWeekData = function populateWeekData(){
    //first check to see if it has been populated today
        //if not update the week
};


function checkWeek(weekInfo, result) {
    console.log("CHECK WEEK:", weekInfo);
    result(null, weekInfo);
}

module.exports= Week;