'user strict';
var sql = require('./db.js');

var Team = function(team){
    this.primaryColor   = team.primaryColor;
    this.secondaryColor = team.secondaryColor;
    this.abbreviation   = team.abbreviation;
    this.name           = team.name;
};

Team.getTeam = function getTeamById(teamId, result) {
    sql.query("SELECT * FROM teams where id = ? ", teamId, function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
};

Team.getAllTeams = function getAllTeams(result) {
    sql.query("SELCT * FROM teams", function(err, res){
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

module.exports= Team;

