'use strict'
var sql = require('./db.js');
var Team = require('./teamModel.js');
var Game = require('./gameModel.js');

var Pick = function(pick) {
    this.game_id        = pick.game_id;
    this.team_id        = pick.team_id;
    this.user_id        = pick.user_id;
}

Pick.getUsersPicksByWeek = function getUsersPicksByWeek(userId, season, week, result) {
    sql.query(
        "SELECT p.pick_id, p.game_id, p.team_id, p.user_id, g.away_team, g.home_team " +
        "FROM picks p, games g " + 
        "WHERE p.game_id = g.game_id " + 
        "AND g.season = ? " +
        "AND g.week = ? " + 
        "AND p.user_id = ? " +
        "AND g.pick_submit_by_date < ?", [season, week, userId, new Date()], function(err, res){
        
        if(err) result(err, null);
        else {
            Pick.picksObjectMapper(res, function(mapppingErr, picksObject){
                result(null, picksObject);
            });
        }
    });
}

Pick.getPicksByWeek = function getPicksByWeek(user, season, week, result) {
    sql.query(        
        "SELECT p.pick_id, p.game_id, p.team_id, p.user_id, g.away_team, g.home_team " +
        "FROM picks p, games g, users u " + 
        "WHERE p.game_id = g.game_id " + 
        "AND g.season = ? " + 
        "AND g.week = ? " +
        "AND u.user_id = p.user_id " +
        "AND u.user_id = ? " +
        "AND u.password = ?", [season, week, user.user_id, user.password], function(err, res) {

        if(err) result(err, null);
        else {
            Pick.picksObjectMapper(res, function(mapppingErr, picksObject){
                result(null, picksObject);
            });
        }
    });
}

Pick.getWeekPicksByGame = function getWeekPicksByGame(season, week, result) {
    let weekPicksObject = {};
    let promises_array = [];

    sql.query(
        "SELECT * FROM games g " +
        "WHERE g.week = ? " + 
        "AND g.season = ?", [week, season], function(err, res) {

        if(err) result(err, null);
        else {
            res.forEach(game => {
                promises_array.push(new Promise((resolve, reject) => {
                    Pick.getPicksByGame(game.game_id, function(errPickByGame, picksByGameRes){
                        if(errPickByGame) {
                            result(err, null);
                            reject();

                        }
                        else {
                            weekPicksObject[game.game_id] = picksByGameRes;
                            resolve();
                        }
                    });
                }));
            });

            Promise.all(promises_array).then(()=>{
                return result(null, weekPicksObject);
            });
        }
    });
}

Pick.getPicksByGame = function getPicksByGame(gameId, result) {
    sql.query(
        "SELECT p.pick_id, p.game_id, p.team_id, p.user_id, u.user_inits, u.first_name, u.last_name " +
        "FROM picks p, users u, games g " + 
        "WHERE p.user_id = u.user_id " + 
        "AND p.game_id = ? " + 
        "AND g.game_id = p.game_id " +
        "AND g.pick_submit_by_date < ? order by u.first_name, u.last_name", [gameId, new Date()], function(err, res){

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
                sql.query("UPDATE picks SET team_id = ? WHERE pick_id = ?", [pick.team_id, id], function(err, res) {
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

    sql.query("SELECT COUNT(*) as count FROM games WHERE game_id in (?) AND pick_submit_by_date < ?", [gameArray, new Date()], function(err, res) {
        if(err) result(err, null);
        else result(null,res[0].count == 0);
    })
}

Pick.picksObjectMapper = function picksObjectMapper(picks, result) {

    var teams = [];
    var games  = [];

    picks.forEach(pick => {
        games.push(pick.game_id);
        teams.push(pick.away_team);
        teams.push(pick.home_team);
    });

    var pickObject = {};
    pickObject.picks = picks;
    pickObject.teams = [];
    pickObject.games = [];

    Team.getTeamsById(teams, function(err, teamObjects){
        if(err){}
        pickObject.teams = teamObjects;
        Game.getGamesById(games, function(err, gameObjects){
            if(err){}
            pickObject.games = gameObjects;
            result(null, pickObject);
        });
    });    
}

module.exports = Pick;

