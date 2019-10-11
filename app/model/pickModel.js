'use strict'
var sql = require('./db.js');

var Pick = function(pick) {
    this.season = pick.season;
    this.week   = pick.week;
    this.gameId = pick.gameId;
    this.teamId = pick.teamId;
    this.userId = pick.userId;
}

Pick.getPicksByUser = function getPicksByUser(userId, result) {
    sql.query("SELECT * FROM picks WHERE userId = ?", userId, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
};

Pick.getPicksByWeek = function getPicksByWeek(userId, season, week, result) {
    sql.query("SELECT * FROM picks WHERE season = ? AND week = ? AND userId = ?", [season, week, userId], function(err, res){
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
    sql.query("SELECT * FROM picks WHERE pickId = ?", id, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
}

Pick.deletePick = function deletePick(id, result) {
    sql.query("DELETE FROM picks WHERE pickId = ?", id, function(err, res) {
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

    sql.query("SELECT COUNT(*) as count FROM games WHERE gameId in (?) AND submitDate < ?", [gameArray, new Date()], function(err, res) {
        if(err) result(err, null);
        else result(null,res[0].count == 0);
    })
}

module.exports = Pick;

