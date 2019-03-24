'user strict';
var sql = require('./db.js');
var Team = require('../model/teamModel.js');

var Game = function(game){
    this.lastUpdated    = game.lastUpdated;
    this.date           = game.date;
    this.week           = game.week;
    this.season         = game.season;
    this.submitDate     = game.submitDate;
    this.homeTeam       = game.homeTeam;
    this.awayTeam       = game.awayTeam;
    this.homeScore      = game.homeScore;
    this.awayScore      = game.awayScore;
    this.spread         = game.spread;
    this.progress       = game.progress;
    this.isOn           = game.isOn;
};
Game.addGame = function addGame(newGame, result) {    
    sql.query("INSERT INTO games set ?", newGame, function (err, res) {
        if(err) result(err, null);
        else result(null, res.insertId);
    });           
};
Game.getGameById = function getGameById(gameId, result) {
    sql.query("Select * from games where id = ? ", gameId, function (err, res) {             
        if(err)result(err, null);
        else result(null, res);
    });   
};
Game.getListGames = function getListGames(listGames, result) {
    var list = '('
    listGames.array.forEach(gameId => {
        list = list + "'" + gameId + "'" + ','; 
    });
    sql.query("Select * from games where id IN = ?", list, function (err, res) {
        if(err) result(err, null);
        else result(null, res);
    });   
};

Game.updateById = function(id, game, result){
    var query = "UPDATE games SET " +
                "lastUpdated = ?" +
                "date = ? " + 
                "week = ? " +
                "season = ? " +
                "submitDate = ?" +
                "homeTeam = ? " +
                "awayTeam = ? " +
                "homeScore = ? " +
                "awayScore = ? " +
                "spread = ? " +
                "progress = ? " +
                "isOn = ? " +
                "WHERE id = ?";
    sql.query(query, [
        game.lastUpdated,
        game.date, 
        game.week,
        game.season,
        game.submitDate, 
        game.homeTeam,
        game.awayTeam,
        game.homeScore,
        game.awayScore,
        game.spread,
        game.progress,
        game.isOn,
        id], function (err, res) {

        if(err) result(err, null);
        else result(null, res);
    }); 
};

Game.remove = function(id, result){
    sql.query("DELETE FROM games WHERE id = ?", [id], function (err, res) {
        if(err) result(err, null);
        else result(null, res);
    }); 
};

Game.insertAPIData = function(data, week, season, result) {
    var data = JSON.parse(data);
    var games = data.games;
    var insertGames = new Promise((resolve, reject) => {
        games.forEach(game => {
            Game.gameMapper(game.schedule, week, season, game.score, function(err, gameMapped) {
                Game.addGame(gameMapped, function(err, res){
                    if(err) reject(result(err, null));
                    resolve(res);
                });
            });
        });
    });

    insertGames.then(()=>{
        Game.editSubmitDate(week, season, function(err, updateResult){
            if(err) result(err, null);
            result(null, updateResult);
        });
    })
};

Game.editSubmitDate = function(week, season, result) {
    Game.getSubmitDateMap(week, season, function(err, dates){
        var updateDates = new Promise((resolve, reject)=>{
            for(var [key, value] of dates){
                sql.query("UPDATE games SET submitDate = ? WHERE id in (?)", [key, value], function(err, res){
                    if(err) reject(err);
                    resolve(res);
                });
            }
        });
        updateDates.then(()=>{
            result(null, "UPDATES SUBMIT DATES");
        })
    });
}

Game.getSubmitDateMap = function(week, season, result) {
    var dateMap = new Map();
    sql.query("SELECT * FROM games WHERE week = ? AND season = ? ORDER BY date", [week, season], function(err, games) {
        if(err) result(err, null);
        else {
            var createMap = new Promise((resolve, reject) => {
                var i = 0;
                games.forEach(game => {
                    if(i != 0){
                        var submitDateCurr = new Date(game.submitDate);
                        var submitDatePast = new Date (games[i - 1].submitDate);
                        if(submitDateCurr.getDay() != submitDatePast.getDay()){
                            var dateList = [];
                            lastKey = game.submitDate;
                            dateList.push(game.id);
                            dateMap.set(lastKey, dateList);
                        } else {
                            dateMap.get(lastKey).push(game.id);
                        }
                    } else {
                        var dateList = [];
                        lastKey = game.submitDate;
                        dateList.push(game.id);
                        dateMap.set(lastKey, dateList);
                    }
                    i++;
                    resolve();
                });
            });

            createMap.then(()=>{
                result(null, dateMap);
            });
        }
    });
}

Game.gameMapper = function(game, week, season, score, result) {
    var gameMapped = {};
    gameMapped.id = game.id;
    gameMapped.lastUpdated = new Date();
    gameMapped.week = week;
    gameMapped.date = new Date(String(game.startTime));
    gameMapped.progress = String(game.playedStatus);
    gameMapped.awayScore = score.awayScoreTotal;
    gameMapped.homeScore = score.homeScoreTotal;
    gameMapped.submitDate = new Date(String(game.startTime));
    gameMapped.isOn = true;
    gameMapped.spread = 0;
    gameMapped.season = season;

    Team.getTeamByAbbrev(game.awayTeam.abbreviation, function(err, awayTeams) {
        if(err) result(err, null);
        else {
            if(awayTeams[0] != null){
                gameMapped.awayTeam = awayTeams[0].id;
                Team.getTeamByAbbrev(game.homeTeam.abbreviation, function(err, homeTeams) { 
                    if(err) result(err, null);
                    else {
                        if(homeTeams[0] != null){
                            gameMapped.homeTeam = homeTeams[0].id;
                            result(null, gameMapped);
                        } else {
                            result("MISSING TEAM", null)
                        }
                    }
                })
            }
            else {
                result("MISSING TEAM", null)
            }
        }
    });
};

module.exports= Game;