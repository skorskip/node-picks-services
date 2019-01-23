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

Game.insertAPIData = function(data, result) {
    var data = JSON.parse(data);
    var games = data.games;
    games.forEach(game => {
        Game.gameMapper(game.schedule, game.score, function(err, gameMapped) {
            console.log('INSERT GAME:', gameMapped);
            Game.addGame(gameMapped, function(err, res){
                if(err) result(err, null);
                else result(null, res);
            });
        });
    });
};

Game.gameMapper = function(game, score, result) {
    var gameMapped = {};
    gameMapped.id = game.id;
    gameMapped.week = game.week;
    gameMapped.date = JSON.stringify(game.startTime);
    gameMapped.progress = JSON.stringify(game.playedStatus);
    gameMapped.awayScore = score.awayScoreTotal;
    gameMapped.homeScore = score.homeScoreTotal;
    gameMapped.submitDate = "";
    gameMapped.isOn = true;
    gameMapped.spread = 7;
    gameMapped.season = 2018;

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
                            //LA
                            //JAX
                            console.log("MISSING TEAM:", game.homeTeam.abbreviation)
                            result("MISSING TEAM", null)
                        }
                    }
                })
            }
            else {
                console.log("MISSING TEAM:", game.awayTeam.abbreviation)
                result("MISSING TEAM", null)
            }
        }
    });
};

module.exports= Game;