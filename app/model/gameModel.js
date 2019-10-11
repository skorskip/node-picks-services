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
    this.status         = game.status;
    this.isOn           = game.isOn;
};

Game.addGame = function addGame(newGame, result) {    
    sql.query("INSERT INTO games set ?", newGame, function (err, res) {
        if(err) result(err, null);
        else result(null, res.insertId);
    });           
};

Game.getGameById = function getGameById(gameId, result) {
    sql.query("Select * from games where gameId = ? ", gameId, function (err, res) {             
        if(err)result(err, null);
        else result(null, res);
    });   
};

Game.getGamesById = function getGamesById(listGameIds, result) {
    sql.query("Select * from games where gameId in (?)", [listGameIds], function (err, res) {
        if(err) result(err, null);
        else result(null, res);
    });   
};

Game.updateById = function(id, game, result){
    sql.query("UPDATE games SET ? WHERE gameId = ?", [game,id], function (err, res) {
        if(err) result(err, null);
        else result(null, res);
    }); 
};

Game.remove = function(id, result){
    sql.query("DELETE FROM games WHERE gameId = ?", [id], function (err, res) {
        if(err) result(err, null);
        else result(null, res);
    }); 
};

Game.insertAPIData = function(data, week, season, result) {
    var data = JSON.parse(data);
    var games = data.games;
    var insertedGames = [];
    var submitDate = null;
    var insertGames = new Promise((resolve, reject) => {
        games.forEach(game => {
            if(submitDate != null) {
                var currStartTime = new Date(game.schedule.startTime);
                if(submitDate.getDay() != currStartTime.getDay()) {
                    submitDate = currStartTime;
                }
            } else {
                submitDate = new Date(game.schedule.startTime);
            }

            Game.gameMapper(game.schedule, week, season, game.score, submitDate, function(err, gameMapped) {
                if(err) reject(err);
                insertedGames.push(gameMapped);
                Game.addGame(gameMapped, function(err, res){
                    if(err) reject(err);
                });
            });
        });

        resolve(insertedGames);
    });

    insertGames.then((res, err) => {
        if(err) result(err, null);
        result(null, res);
    });
};

Game.gameMapper = function(game, week, season, score, submitDate, result) {
    var gameMapped = {};

    gameMapped.gameId = game.id;
    gameMapped.lastUpdated = new Date();
    gameMapped.week = week;
    gameMapped.date = new Date(String(game.startTime));
    gameMapped.status = String(game.playedStatus);
    gameMapped.awayScore = score.awayScoreTotal;
    gameMapped.homeScore = score.homeScoreTotal;
    gameMapped.submitDate = submitDate;
    gameMapped.isOn = true;
    gameMapped.spread = -1;
    gameMapped.season = season;

    var getAwayTeam = new Promise((resolve, reject) => {
        Team.getTeamByAbbrev(game.awayTeam.abbreviation, function(err, awayTeams) {
            if(err) result(err, null);
            else {
                if(awayTeams[0] != null){
                    resolve(gameMapped.awayTeam = awayTeams[0].teamId);
                }
                else {
                    reject(result("MISSING TEAM: " + game.awayTeam.abbreviation, null));
                }
            }
        });
    });

    getAwayTeam.then(() => {
        Team.getTeamByAbbrev(game.homeTeam.abbreviation, function(err, homeTeams) { 
            if(err) result(err, null);
            else {
                if(homeTeams[0] != null){
                    gameMapped.homeTeam = homeTeams[0].teamId;
                    result(null, gameMapped);
                } else {
                    result("MISSING TEAM: " + game.homeTeam.abbreviation, null);
                }
            }
        })
    });
};

module.exports= Game;