'user strict';
var sql = require('./db.js');

var Team = function(team){
    this.primaryColor   = team.primaryColor;
    this.secondaryColor = team.secondaryColor;
    this.abbreviation   = team.abbreviation;
    this.name           = team.name;
};

Team.getTeam = function getTeam(teamId, result) {
    sql.query("SELECT * FROM teams where teamId = ? ", teamId, function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
};

Team.getAllTeams = function getAllTeams(req, result) {
    sql.query("SELECT * FROM teams", req, function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
};

Team.getTeamByAbbrev = function getTeamByAbbrev(teamAbbrev, result) {
    sql.query("SELECT * FROM teams where abbreviation = ?", teamAbbrev, function(err, res){
        if(err) result(err, null);
        else result(null,res);
    });
};

Team.getTeamsById = function getTeamsById(teamIds, result) {
    console.log(teamIds);
    sql.query("SELECT * FROM teams WHERE teamId in (?)", [teamIds], function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
}

module.exports= Team;

