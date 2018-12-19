'user strict';
var sql = require('./db.js');

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
        if(err) result(null, err);
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

        if(err) result(null, err);
        else result(null, res);
    }); 
};
Game.remove = function(id, result){
    sql.query("DELETE FROM games WHERE id = ?", [id], function (err, res) {
        if(err) result(null, err);
        else result(null, res);
    }); 
};

module.exports= Game;