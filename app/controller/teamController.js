'use strict';

var Team = require('../model/teamModel.js');

exports.getTeam = function(req, res) {
    Team.getTeam(req.params.teamId, function(err, team) {
        if (err) res.send(err);
        res.json(team);
    });
};

exports.getAllTeams = function(req, res) {
    Team.getAllTeams(req, function(err, teams) {
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

exports.getTeamsById = function(req, res) {
    console.log(req.body);
    Team.getTeamsById(req.body, function(err, teams) {
        if(err) res.send(err);
        res.json(teams);
    })
};