'use strict'
var sql = require('./db.js');

var Pick = function(pick) {
    this.game_id        = pick.game_id;
    this.team_id        = pick.team_id;
    this.user_id        = pick.user_id;
}

Pick.getPicksByUser = function getPicksByUser(userId, result) {
    sql.query("SELECT * FROM picks WHERE user_id = ?", userId, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
};

Pick.getPicksByWeek = function getPicksByWeek(userId, season, week, result) {
    sql.query(
        "SELECT p.game_id, p.api_team_id, p.user_id" +
        "FROM picks p, games g" + 
        "WHERE p.game_id = g.game_id" + 
        "g.season = ? AND g.week = ? AND p.user_id = ?", [season, week, userId], function(err, res){
        
        if(err) result(err, null);
        else result(null, res);
    });
}

Pick.addPicks = function addPicks(picks, result) {
    this.checkPicksDateValid(picks, function(errorCheckDate, valid) {
        if(errorCheckDate) {
            result(errorCheckDate, null);
        } else if(valid) {
            let keys = Object.keys(picks[0]);
            let values = picks.map( obj => keys.map( key => obj[key]));
            let query = 'INSERT INTO picks (' + keys.join(',') + ') VALUES ?';
            sql.query(query, [values], function(err, res) {
                if(err) result(null, err);
                else result(null, "SUCCESS");
            });
        } else {
            result(null, "PAST SUBMISSION DATE")
        }
    });
}

Pick.getPick = function getPick(id, result) {
    sql.query("SELECT * FROM picks WHERE pick_id = ?", id, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
}

Pick.deletePick = function deletePick(id, result) {
    sql.query("DELETE FROM picks WHERE pick_id = ?", id, function(err, res) {
        if(err) result(err, null);
        else result(null, "SUCCESS");
    });
}

Pick.updatePick = function updatePick(id, pick, result) {
    var picks = [];
    picks.push(pick);

    this.checkPicksDateValid(picks, function(errorCheckDate, valid) {
        if(errorCheckDate) {
            result(errorCheckDate, null);
        } else {
            if(valid) {
                sql.query("UPDATE picks SET teamId = ? WHERE pickId = ?", [pick.teamId, id], function(err, res) {
                    if(err) result(err, null);
                    else result(null, "SUCCESS");
                });
            } else {
                result(null, "PAST SUBMISSION DATE");
            }
        }
    });
}

Pick.checkPicksDateValid = function checkPicksDateValid(picks, result) {
    let gameArray = [];
    for(var i = 0; i < picks.length; i++) {
        gameArray.push(picks[i].gameId);
    }

    sql.query("SELECT COUNT(*) as count FROM games WHERE game_id in (?) AND start_time < ?", [gameArray, new Date()], function(err, res) {
        if(err) result(err, null);
        else result(null,res[0].count == 0);
    })
}

module.exports = Pick;

