'use strict';

var Game = require('../model/gameModel.js');

exports.getGamesById = function(req, res) {
  var listGames = req.body;
  if(listGames.length == 0){
      res.status(400).send({ error:true, message: 'Please provide list of game ids' });
  }
  else{
      Game.getGamesById(listGames, function(err, games) {
          if (err) res.send(err);
          res.json(games);
      });
  }
};

exports.addGame = function(req, res) {
  var newGame = new Game(req.body);
  //handles null error 
  if(newGame.homeTeam == ""){
      res.status(400).send({ error:true, message: 'Please provide game' });
  }
  else{
      Game.addGame(newGame, function(err, game) {
          if (err) res.send(err);
          res.json(game);
      });
  }
};

exports.getGame = function(req, res) {
  Game.getGameById(req.params.gameId, function(err, game) {
    if (err)
      res.send(err);
    res.json(game);
  });
};

exports.updateGame= function(req, res) {
  Game.updateById(req.params.gameId, new Game(req.body), function(err, game) {
    if (err) res.send(err);
    res.json(game);
  });
};

exports.deleteGame = function(req, res) {
  Game.remove( req.params.gameId, function(err, game) {
      if (err) res.send(err);
      res.json({ message: 'Game successfully deleted' });
  });
};