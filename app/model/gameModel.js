'user strict';
var sql = require('./db.js');

//Task object constructor
var Game = function(game){
    this.date       = game.date;
    this.submitDate = game.submitDate;
    this.homeTeam   = game.homeTeam;
    this.awayTeam   = game.awayTeam;
    this.homeScore  = game.homeScore;
    this.awayScore  = game.awayScore;
    this.spread     = game.spread;
    this.progress   = game.progress;
    this.isOn       = game.isOn;
};
Game.addGame = function addGame(newGame, result) {    
    sql.query("INSERT INTO games set ?", newGame, function (err, res) {
        console.log(newGame);
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
                "date = ? " + 
                "submitDate = ?" +
                "homeTeam = ? " +
                "awayTeam = ? " +
                "homeScore = ? " +
                "awayScore = ? " +
                "spread = ? " +
                "progress = ? " +
                "isOn = ? " +
                "WHERE id = ?";
    sql.query(query, [game.date, 
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