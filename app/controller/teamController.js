'use strict';

var Team = require('../model/gameModel.js');

exports.getTeam = function(req, res) {
    Team.getTeamById(req.params.teamId, function(err, team) {
        if (err) res.send(err);
        res.json(team);
    });
};

exports.getAllTeams = function(res) {
    Team.getAllTeams(function(err, teams) {
        if (err) res.send(err);
        res.json(teams);
    });
};

exports.getTeamByAbbrev = function(req, res){
    Team.getTeamByAbbrev(req.params.teamAbbrev, function(err, team) {
        if(err) res.send(err);
        res.json(team);
    })
};