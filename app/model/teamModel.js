'user strict';
var sql = require('./db.js');

var Team = function(team){
    this.team_city          = team.team_city;
    this.team_name          = team.team_name;
    this.abbreviation       = team.abbreviation;
    this.primary_color      = team.primary_color;
    this.secondary_color    = team.secondary_color;
    this.display_color      = team.display_color;
};

Team.getTeam = function getTeam(teamId, result) {
    sql.query("SELECT * FROM teams where team_id = ? ", teamId, function(err, res){
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
    if(teamIds.length > 0) {
        sql.query("SELECT * FROM teams WHERE team_id in (?)", [teamIds], function(err, res){
            if(err) result(err, null);
            else result(null, res);
        });
    } else {
        result(null, []);
    }
}

module.exports= Team;

